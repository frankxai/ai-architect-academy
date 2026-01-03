---
title: "JD Edwards Data Structure Template"
type: "template"
category: "data-architecture"
version: "1.0"
status: "active"
description: "Machine-readable XML template for defining ERP data structures for AI use cases and HTML mockups"
tags:
  - "jd-edwards"
  - "erp-data"
  - "data-structure"
  - "ai-integration"
  - "xml-template"
  - "pharmaceutical"
  - "manufacturing"
  - "sales-orders"
  - "quality-control"
features:
  - "Comprehensive ERP module coverage"
  - "Structured and unstructured data support"
  - "AI use case mapping capabilities"
  - "Data quality rule definitions"
  - "Integration specification templates"
  - "Pharmaceutical compliance requirements"
  - "Machine-readable XML format"
  - "Relationship mapping between tables"
created: "2025-01-16"
updated: "2025-01-16"
author: "Data Architecture Team"
source_system: "JD Edwards EnterpriseOne"
compliance:
  - "FDA 21 CFR Part 11"
  - "GMP Compliance"
  - "GDPR"
template_structure:
  data_source:
    - "source identification and configuration"
    - "connection specifications"
    - "compliance requirements"
  business_modules:
    - "sales order management"
    - "manufacturing management"
    - "procurement management"
    - "distribution management"
    - "financial management"
  data_tables:
    - "structured table definitions"
    - "column specifications with data types"
    - "business descriptions and constraints"
    - "relationship mappings"
  data_objects:
    - "unstructured data schemas (JSON)"
    - "nested field definitions"
    - "pharmaceutical-specific data (COA, batch records)"
  ai_use_cases:
    - "demand forecasting mappings"
    - "quality prediction requirements"
    - "data transformation specifications"
  data_quality_rules:
    - "validation logic definitions"
    - "completeness checks"
    - "range validations"
  integration_specs:
    - "API endpoint configurations"
    - "ETL pipeline specifications"
    - "authentication and rate limiting"
usage_scenarios:
  - "Generate sample data for HTML mockups"
  - "Create database schemas for development"
  - "Map AI requirements to data sources"
  - "Validate data structure compliance"
  - "Generate API documentation"
  - "Create data integration specifications"
pharmaceutical_focus:
  - "Batch and lot traceability"
  - "Quality control test results"
  - "Certificate of Analysis (COA) management"
  - "Manufacturing campaign tracking"
  - "Regulatory compliance documentation"
format: "xml"
---

<?xml version="1.0" encoding="UTF-8"?>
<data_structure_template>
  <metadata>
    <template_version>1.0</template_version>
    <created_date>2025-01-16</created_date>
    <description>Machine-readable template for defining data structures for AI use cases and HTML mockups</description>
    <based_on>JD Edwards EnterpriseOne Data Structure</based_on>
  </metadata>

  <!-- Data Source Configuration -->
  <data_source>
    <source_id>jde_erp_system</source_id>
    <source_name>JD Edwards EnterpriseOne</source_name>
    <source_type>ERP_DATABASE</source_type>
    <connection_type>DATABASE</connection_type>
    <is_real_time>false</is_real_time>
    <update_frequency>BATCH_HOURLY</update_frequency>
    <data_retention_years>7</data_retention_years>
    <compliance_requirements>
      <requirement>FDA_21_CFR_PART_11</requirement>
      <requirement>GMP_COMPLIANCE</requirement>
      <requirement>GDPR</requirement>
    </compliance_requirements>
  </data_source>

  <!-- Business Modules -->
  <business_modules>
    
    <!-- Sales Order Management Module -->
    <module>
      <module_id>sales_order_mgmt</module_id>
      <module_name>Sales Order Management</module_name>
      <module_description>Customer orders, pricing, and sales process management</module_description>
      
      <data_tables>
        <!-- Sales Orders Header Table -->
        <table>
          <table_id>sales_orders_header</table_id>
          <table_name>Sales Orders (F4201)</table_name>
          <table_type>STRUCTURED</table_type>
          <is_master_data>false</is_master_data>
          <is_transactional>true</is_transactional>
          <primary_key>order_number</primary_key>
          
          <columns>
            <column>
              <column_id>order_number</column_id>
              <column_name>Order Number</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>20</max_length>
              <is_nullable>false</is_nullable>
              <is_unique>true</is_unique>
              <format_pattern>SO[0-9]{8}</format_pattern>
              <business_description>Unique identifier for sales order</business_description>
            </column>
            <column>
              <column_id>customer_id</column_id>
              <column_name>Customer ID</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>15</max_length>
              <is_nullable>false</is_nullable>
              <format_pattern>CUST[0-9]{6}</format_pattern>
              <business_description>Reference to customer master record</business_description>
            </column>
            <column>
              <column_id>order_date</column_id>
              <column_name>Order Date</column_name>
              <data_type>DATE</data_type>
              <is_nullable>false</is_nullable>
              <format_pattern>YYYY-MM-DD</format_pattern>
              <business_description>Date when order was placed</business_description>
            </column>
            <column>
              <column_id>requested_date</column_id>
              <column_name>Requested Delivery Date</column_name>
              <data_type>DATE</data_type>
              <format_pattern>YYYY-MM-DD</format_pattern>
              <business_description>Customer requested delivery date</business_description>
            </column>
            <column>
              <column_id>order_status</column_id>
              <column_name>Order Status</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>2</max_length>
              <is_nullable>false</is_nullable>
              <allowed_values>
                <value code="10">Open</value>
                <value code="20">In Progress</value>
                <value code="30">Shipped</value>
                <value code="99">Completed</value>
              </allowed_values>
              <business_description>Current status of the order</business_description>
            </column>
            <column>
              <column_id>total_amount</column_id>
              <column_name>Total Order Amount</column_name>
              <data_type>DECIMAL</data_type>
              <precision>15</precision>
              <scale>2</scale>
              <currency>USD</currency>
              <business_description>Total monetary value of the order</business_description>
            </column>
          </columns>
          
          <relationships>
            <relationship>
              <relationship_type>FOREIGN_KEY</relationship_type>
              <related_table>customer_master</related_table>
              <local_column>customer_id</local_column>
              <foreign_column>customer_id</foreign_column>
              <relationship_name>order_to_customer</relationship_name>
            </relationship>
          </relationships>
        </table>

        <!-- Customer Master Table -->
        <table>
          <table_id>customer_master</table_id>
          <table_name>Customer Master (F0301)</table_name>
          <table_type>STRUCTURED</table_type>
          <is_master_data>true</is_master_data>
          <is_transactional>false</is_transactional>
          <primary_key>customer_id</primary_key>
          
          <columns>
            <column>
              <column_id>customer_id</column_id>
              <column_name>Customer ID</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>15</max_length>
              <is_nullable>false</is_nullable>
              <is_unique>true</is_unique>
              <format_pattern>CUST[0-9]{6}</format_pattern>
              <business_description>Unique customer identifier</business_description>
            </column>
            <column>
              <column_id>customer_name</column_id>
              <column_name>Customer Name</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>100</max_length>
              <is_nullable>false</is_nullable>
              <business_description>Legal name of customer</business_description>
            </column>
            <column>
              <column_id>credit_limit</column_id>
              <column_name>Credit Limit</column_name>
              <data_type>DECIMAL</data_type>
              <precision>15</precision>
              <scale>2</scale>
              <currency>USD</currency>
              <business_description>Maximum credit extended to customer</business_description>
            </column>
            <column>
              <column_id>payment_terms</column_id>
              <column_name>Payment Terms</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>10</max_length>
              <allowed_values>
                <value code="NET30">Net 30 Days</value>
                <value code="NET60">Net 60 Days</value>
                <value code="COD">Cash on Delivery</value>
              </allowed_values>
              <business_description>Standard payment terms for customer</business_description>
            </column>
          </columns>
        </table>
      </data_tables>
    </module>

    <!-- Manufacturing Management Module -->
    <module>
      <module_id>manufacturing_mgmt</module_id>
      <module_name>Manufacturing Management</module_name>
      <module_description>Production orders, batch records, and quality control</module_description>
      
      <data_tables>
        <!-- Work Orders Table -->
        <table>
          <table_id>work_orders</table_id>
          <table_name>Work Orders (F4801)</table_name>
          <table_type>STRUCTURED</table_type>
          <is_master_data>false</is_master_data>
          <is_transactional>true</is_transactional>
          <primary_key>work_order_number</primary_key>
          
          <columns>
            <column>
              <column_id>work_order_number</column_id>
              <column_name>Work Order Number</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>20</max_length>
              <is_nullable>false</is_nullable>
              <is_unique>true</is_unique>
              <format_pattern>WO[0-9]{8}</format_pattern>
              <business_description>Unique manufacturing order identifier</business_description>
            </column>
            <column>
              <column_id>item_number</column_id>
              <column_name>Item Number</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>25</max_length>
              <is_nullable>false</is_nullable>
              <format_pattern>[A-Z]{3}[0-9]{7}</format_pattern>
              <business_description>Product being manufactured</business_description>
            </column>
            <column>
              <column_id>batch_number</column_id>
              <column_name>Batch Number</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>20</max_length>
              <is_nullable>false</is_nullable>
              <format_pattern>BATCH[0-9]{10}</format_pattern>
              <business_description>Pharmaceutical batch identifier for traceability</business_description>
            </column>
            <column>
              <column_id>planned_quantity</column_id>
              <column_name>Planned Quantity</column_name>
              <data_type>DECIMAL</data_type>
              <precision>12</precision>
              <scale>3</scale>
              <business_description>Planned production quantity</business_description>
            </column>
            <column>
              <column_id>actual_quantity</column_id>
              <column_name>Actual Quantity</column_name>
              <data_type>DECIMAL</data_type>
              <precision>12</precision>
              <scale>3</scale>
              <business_description>Actual production quantity</business_description>
            </column>
            <column>
              <column_id>manufacturing_campaign</column_id>
              <column_name>Manufacturing Campaign</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>30</max_length>
              <business_description>Campaign identifier for pharmaceutical production</business_description>
            </column>
            <column>
              <column_id>quality_status</column_id>
              <column_name>Quality Status</column_name>
              <data_type>VARCHAR</data_type>
              <max_length>10</max_length>
              <allowed_values>
                <value code="PENDING">Pending Test</value>
                <value code="PASSED">Quality Passed</value>
                <value code="FAILED">Quality Failed</value>
                <value code="RELEASED">Released for Sale</value>
              </allowed_values>
              <business_description>Quality control status of batch</business_description>
            </column>
          </columns>

          <relationships>
            <relationship>
              <relationship_type>FOREIGN_KEY</relationship_type>
              <related_table>item_master</related_table>
              <local_column>item_number</local_column>
              <foreign_column>item_number</foreign_column>
              <relationship_name>work_order_to_item</relationship_name>
            </relationship>
          </relationships>
        </table>

        <!-- Quality Control Results (Unstructured Data Example) -->
        <data_object>
          <object_id>quality_control_results</object_id>
          <object_name>Quality Control Test Results</object_name>
          <object_type>UNSTRUCTURED</object_type>
          <storage_format>JSON</storage_format>
          <is_real_time>false</is_real_time>
          
          <schema_definition>
            <field>
              <field_name>batch_number</field_name>
              <data_type>string</data_type>
              <required>true</required>
              <description>Reference to manufacturing batch</description>
            </field>
            <field>
              <field_name>test_date</field_name>
              <data_type>datetime</data_type>
              <required>true</required>
              <format>ISO8601</format>
              <description>Date and time when test was performed</description>
            </field>
            <field>
              <field_name>test_results</field_name>
              <data_type>array</data_type>
              <required>true</required>
              <description>Array of test result objects</description>
              <nested_schema>
                <field>
                  <field_name>test_name</field_name>
                  <data_type>string</data_type>
                  <description>Name of quality test performed</description>
                </field>
                <field>
                  <field_name>result_value</field_name>
                  <data_type>number</data_type>
                  <description>Numeric test result</description>
                </field>
                <field>
                  <field_name>specification_min</field_name>
                  <data_type>number</data_type>
                  <description>Minimum acceptable value</description>
                </field>
                <field>
                  <field_name>specification_max</field_name>
                  <data_type>number</data_type>
                  <description>Maximum acceptable value</description>
                </field>
                <field>
                  <field_name>pass_fail</field_name>
                  <data_type>boolean</data_type>
                  <description>Whether test passed specifications</description>
                </field>
              </nested_schema>
            </field>
            <field>
              <field_name>technician_id</field_name>
              <data_type>string</data_type>
              <required>true</required>
              <description>ID of technician who performed tests</description>
            </field>
            <field>
              <field_name>certificate_of_analysis</field_name>
              <data_type>object</data_type>
              <description>COA document metadata</description>
              <nested_schema>
                <field>
                  <field_name>document_id</field_name>
                  <data_type>string</data_type>
                  <description>COA document identifier</description>
                </field>
                <field>
                  <field_name>file_path</field_name>
                  <data_type>string</data_type>
                  <description>File system path to COA document</description>
                </field>
                <field>
                  <field_name>digital_signature</field_name>
                  <data_type>string</data_type>
                  <description>Digital signature for FDA compliance</description>
                </field>
              </nested_schema>
            </field>
          </schema_definition>

          <relationships>
            <relationship>
              <relationship_type>REFERENCE</relationship_type>
              <related_table>work_orders</related_table>
              <local_field>batch_number</local_field>
              <foreign_field>batch_number</foreign_field>
              <relationship_name>quality_to_batch</relationship_name>
            </relationship>
          </relationships>
        </data_object>
      </data_tables>
    </module>
  </business_modules>

  <!-- AI Use Case Mappings -->
  <ai_use_cases>
    <use_case>
      <use_case_id>demand_forecasting</use_case_id>
      <use_case_name>Demand Forecasting</use_case_name>
      <description>Predict future product demand using historical sales data</description>
      <ai_technique>TIME_SERIES_ANALYSIS</ai_technique>
      
      <required_data_sources>
        <data_source>
          <table_id>sales_orders_header</table_id>
          <columns>
            <column>order_date</column>
            <column>total_amount</column>
            <column>customer_id</column>
          </columns>
        </data_source>
        <data_source>
          <table_id>customer_master</table_id>
          <columns>
            <column>customer_name</column>
            <column>customer_id</column>
          </columns>
        </data_source>
      </required_data_sources>
      
      <data_transformations>
        <transformation>
          <type>AGGREGATION</type>
          <description>Group sales by month and product</description>
        </transformation>
        <transformation>
          <type>TIME_SERIES</type>
          <description>Create time-based features for forecasting</description>
        </transformation>
      </data_transformations>
    </use_case>

    <use_case>
      <use_case_id>quality_prediction</use_case_id>
      <use_case_name>Quality Prediction</use_case_name>
      <description>Predict quality outcomes based on manufacturing parameters</description>
      <ai_technique>MACHINE_LEARNING</ai_technique>
      
      <required_data_sources>
        <data_source>
          <table_id>work_orders</table_id>
          <columns>
            <column>batch_number</column>
            <column>planned_quantity</column>
            <column>actual_quantity</column>
            <column>quality_status</column>
          </columns>
        </data_source>
        <data_source>
          <object_id>quality_control_results</object_id>
          <fields>
            <field>batch_number</field>
            <field>test_results</field>
          </fields>
        </data_source>
      </required_data_sources>
    </use_case>
  </ai_use_cases>

  <!-- Data Quality Rules -->
  <data_quality_rules>
    <rule>
      <rule_id>batch_traceability</rule_id>
      <rule_name>Batch Traceability Completeness</rule_name>
      <description>Every manufactured batch must have complete traceability</description>
      <rule_type>COMPLETENESS</rule_type>
      <applies_to>work_orders.batch_number</applies_to>
      <validation_logic>NOT NULL AND LENGTH >= 10</validation_logic>
    </rule>
    
    <rule>
      <rule_id>order_date_validity</rule_id>
      <rule_name>Order Date Range Validation</rule_name>
      <description>Order dates must be within reasonable business range</description>
      <rule_type>RANGE_CHECK</rule_type>
      <applies_to>sales_orders_header.order_date</applies_to>
      <validation_logic>order_date >= CURRENT_DATE - 5 YEARS AND order_date <= CURRENT_DATE</validation_logic>
    </rule>
  </data_quality_rules>

  <!-- Integration Specifications -->
  <integration_specs>
    <api_endpoint>
      <endpoint_id>sales_data_api</endpoint_id>
      <endpoint_name>Sales Data API</endpoint_name>
      <endpoint_url>/api/v1/sales/orders</endpoint_url>
      <method>GET</method>
      <authentication>OAuth2</authentication>
      <rate_limit>1000_per_hour</rate_limit>
      <response_format>JSON</response_format>
      <caching_strategy>5_minutes</caching_strategy>
    </api_endpoint>
    
    <data_pipeline>
      <pipeline_id>manufacturing_etl</pipeline_id>
      <pipeline_name>Manufacturing Data ETL</pipeline_name>
      <source_system>JD_EDWARDS</source_system>
      <target_system>AI_DATA_LAKE</target_system>
      <frequency>HOURLY</frequency>
      <transformation_engine>ORACLE_DATA_INTEGRATION</transformation_engine>
    </data_pipeline>
  </integration_specs>
</data_structure_template>