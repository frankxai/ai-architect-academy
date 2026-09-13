import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="pb-24 pt-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl">There is nothing at this address.</h1>
      <p className="mt-6">
        <Link href="/" className="link">
          Back to the start
        </Link>
      </p>
    </section>
  )
}
