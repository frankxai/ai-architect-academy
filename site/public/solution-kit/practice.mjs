// Pure deterministic fixture logic. No model, network, credentials or release authority.
export const PRACTICE_SCHEMA = 'ai-architect-practice/v1';
export const CAPSULE_SCHEMA = 'ai-architect-practice-capsule/v1';
const canonical = value => JSON.stringify(value && typeof value === 'object'
  ? Array.isArray(value) ? value.map(v=>JSON.parse(canonical(v)))
    : Object.fromEntries(Object.keys(value).sort().map(k=>[k,JSON.parse(canonical(value[k]))]))
  : value);

export function validatePractice(contract, sources) {
  if(contract.schema!==PRACTICE_SCHEMA || contract.fixture!==true || contract.policy_state!=='proposed') throw new Error('Public proposed practice fixture required');
  const ids=new Set();
  for(const gate of contract.gates){
    if(!/^[a-z][a-z0-9-]+$/.test(gate.id)||ids.has(gate.id)||!gate.owner||!gate.artifact||!gate.failure||gate.observed!==null) throw new Error('Invalid or unsupported gate evidence');
    ids.add(gate.id);
  }
  if(ids.size<1) throw new Error('Quality gates required');
  const sourceIds=new Set(sources.map(s=>s.id));
  for(const product of contract.products){
    const url=new URL(product.url);
    if(url.protocol!=='https:'||url.hostname!=='github.com'||url.username||url.password||!/^\/frankxai\/(?:ai-architect|ai-architect-academy)(?:\/|$)/.test(url.pathname)||!product.name||!product.job||!product.state)throw new Error('Product links must name canonical public source records');
  }
  for(const item of contract.tools){
    if(!item.job||!item.limit||!Array.isArray(item.sources)||!item.sources.every(id=>sourceIds.has(id))) throw new Error('Tool source obligation unresolved');
    if(new URL(item.url).protocol!=='https:') throw new Error('HTTPS tool URL required');
  }
  for(const metric of contract.metrics){
    if(!ids.has(metric.gate)||!metric.definition||!metric.denominator||!metric.window||!metric.target||metric.observed!==null) throw new Error('Metrics require defined denominators and unknown observations');
  }
  return contract;
}

export function evaluateBrief(artifact, references, asOf, reviewedRevision=null) {
  const findings=[];
  if(reviewedRevision!==null && reviewedRevision!==artifact.revision) findings.push('Artifact changed after review');
  for(const claim of artifact.claims){
    const source=references.find(s=>s.id===claim.source);
    if(!source) findings.push(`${claim.id}: missing source`);
    else if(source.visibility!=='public') findings.push(`${claim.id}: source outside public scope`);
    else if(source.checked_on>asOf) findings.push(`${claim.id}: source check is in the future`);
    else if(source.review_by<asOf) findings.push(`${claim.id}: source review expired`);
  }
  if(!artifact.claims.length) findings.push('No claims to inspect');
  return {state:findings.length?'blocked-fixture':'passed-fixture',findings,claims:artifact.claims.length};
}

export function fixtureReferences() {
  return [
    {id:'current-reference',visibility:'public',checked_on:'2026-10-11',review_by:'2026-10-18'},
    {id:'expired-reference',visibility:'public',checked_on:'2026-10-01',review_by:'2026-10-10'},
    {id:'restricted-reference',visibility:'private',checked_on:'2026-10-11',review_by:'2026-10-18'},
    {id:'future-reference',visibility:'public',checked_on:'2026-10-12',review_by:'2026-10-18'}
  ];
}
export function fixtureBrief(corrected=false) {
  return {id:'research-brief-fixture',revision:corrected?2:1,fixture:true,claims:[
    {id:'finding-01',text:'Compare the proposed designs against the customer data boundary.',source:'current-reference'},
    {id:'finding-02',text:'Recheck the operating assumptions before implementation.',source:corrected?'current-reference':'expired-reference'}
  ]};
}
export function runFixtureSuite() {
  const refs=fixtureReferences(),good=fixtureBrief(true);
  const withSource=id=>({...good,claims:[{...good.claims[0],source:id}]});
  return [
    ['current references',good,null,'passed-fixture'],
    ['expired review',withSource('expired-reference'),null,'blocked-fixture'],
    ['future check',withSource('future-reference'),null,'blocked-fixture'],
    ['private source',withSource('restricted-reference'),null,'blocked-fixture'],
    ['missing citation',withSource('absent'),null,'blocked-fixture'],
    ['changed after review',good,1,'blocked-fixture']
  ].map(([name,artifact,reviewed,expected])=>{
    const result=evaluateBrief(artifact,refs,'2026-10-11',reviewed);
    return {name,expected,result,pass:result.state===expected};
  });
}
export function practiceEvidence(action) {
  if(!['draft','checked','corrected'].includes(action)) throw new Error('Unknown fixture action');
  const artifact=fixtureBrief(action==='corrected');
  return {action,artifact,
    checks:action==='draft'?null:evaluateBrief(artifact,fixtureReferences(),'2026-10-11'),
    suite:action==='draft'?[]:runFixtureSuite(),independent_review:null,provider_deployment:null,model_run:null};
}
export function makeCapsule(action,sourceRevision) {
  if(typeof sourceRevision!=='string'||!/^[a-f0-9]{40}$/.test(sourceRevision)) throw new Error('Immutable revision required');
  return {schema:CAPSULE_SCHEMA,fixture:true,source_revision:sourceRevision,...practiceEvidence(action)};
}
export function restoreCapsule(input,sourceRevision) {
  if(typeof input!=='string'||input.length>50000) throw new Error('Expected a capsule smaller than 50 KB');
  const candidate=JSON.parse(input);
  if(candidate.schema!==CAPSULE_SCHEMA||candidate.fixture!==true||candidate.source_revision!==sourceRevision) throw new Error('Capsule source or fixture mismatch');
  const expected=makeCapsule(candidate.action,sourceRevision);
  if(canonical(candidate)!==canonical(expected)) throw new Error('Capsule differs from the reproducible fixture; review grants cannot be imported');
  return expected;
}
