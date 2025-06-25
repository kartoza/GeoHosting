# Service Level Agreement (SLA)

![GHSlogo](https://kartoza.com/files/GSH%20Logo.png)

## Kartoza Hosting and SaaS Services

This Service Level Agreement (“SLA”) is entered into by and between:

1. **Kartoza, LDA** (“Hosting Provider”), a company incorporated under the laws
   of Portugal, and

2. **[Client Name]** (“Client”), whose details are specified in the associated
   Hosting Service Agreement.

This SLA governs the provision of hosting and SaaS services and outlines the
Hosting Provider’s obligations, Client responsibilities, service levels,
dispute resolution, and limitations of liability.

---

## 1. Definitions

1.1 **“Service”**: The hosting and SaaS services provided by the Hosting
Provider as outlined in the Hosting Agreement.

1.2 **“Uptime”**: The percentage of total time within a calendar month during
which the Service is fully operational, excluding Excluded Downtime.

1.3 **“Excluded Downtime”**: Includes the following:

- **Scheduled Maintenance**: Maintenance activities announced at least 48 hours
  in advance.
- **Emergency Maintenance**: Urgent maintenance required to address critical
  security vulnerabilities or outages.
- **Force Majeure Events**: Circumstances beyond the Hosting Provider’s
  reasonable control (see Section 3).
- **Client-Caused Issues**: Downtime caused by the Client’s misuse,
  unauthorized changes, or third-party integrations.

1.4 **“RTO (Recovery Time Objective)”**: The maximum time allowed to restore
services after a major disruption.

1.5 **“RPO (Recovery Point Objective)”**: The maximum allowable data loss
period based on the frequency of backups.

1.6 **“Confidential Information”**: Any information disclosed by one party to
the other in connection with this SLA, marked as confidential or which a
reasonable person would consider confidential.

---

## 2. Service Level Commitments

2.1 **Uptime Guarantee**:
The Hosting Provider guarantees 99.9% uptime per calendar month. Uptime is
calculated as follows:
`Uptime = ((Total Minutes - Excluded Downtime) / Total Minutes) × 100`

2.2 **Service Metrics**:
The Hosting Provider guarantees the following additional performance metrics:

- **Latency**: Average response time for server requests shall not exceed 200ms
  under normal operating conditions.
- **Bandwidth**: A minimum bandwidth of 1000 Mbps will be maintained for all
  hosted connections.

2.3 **Incident Prioritization and Response Times**:
Incidents are categorized as follows, with corresponding response and
resolution times:

| **Priority** | **Definition**                    | **Response Time** | **Resolution Time** |
|--------------|-----------------------------------|-------------------|---------------------|
| Critical     | Service completely unavailable    | 1 hour            | 4 hours             |
| High         | Severe degradation of services    | 4 hours           | 24 hours            |
| Medium       | Minor issues or degraded services | 8 hours           | 48 hours            |
| Low          | Non-urgent issues or queries      | 24 hours          | 72 hours            |

2.4 **Disaster Recovery**:

- **RTO**: Restoration of services within 4 hours.
- **RPO**: Data restored to within 24 hours of the last backup (our database
  backups are made nightly).

2.5 **Performance Disclaimer**:
The Hosting Provider does not warrant that the Service will be uninterrupted or
error-free and shall not be liable for downtime resulting from circumstances
beyond its reasonable control.

---

## 3. Exclusions

The SLA does not apply to:

- **Scheduled Maintenance**: Activities announced at least 48 hours in advance.
- **Emergency Maintenance**: Security patches or urgent repairs that may not
  include advance notice.
- **Client Misuse**: Downtime caused by the Client’s misconfigurations,
  unauthorized use, or failure to comply with requirements.
- **Third-Party Providers**: Outages or performance issues originating from
  third-party integrations, plugins, or hosting dependencies outside the
  Hosting Provider’s control.
- **Force Majeure**: Events beyond reasonable control, such as natural
  disasters, government actions, or cyberattacks.

---

## 4. Data Protection and Security

4.1 **Compliance with Data Laws**:

- The Hosting Provider complies with the General Data Protection
  Regulation (GDPR) and related EU directives.

4.2 **Encryption Standards**:

- Data in transit is encrypted using TLS 1.2 or higher.
- Data at rest is encrypted using AES-256 encryption or an equivalent standard.

4.3 **Data Backup Policy**:

- Full backups of all Client data are performed every 24 hours.
- Backups are retained for a period of 30 days.
- Restoration requests initiated by the Client will be processed within 24
  hours.

4.4 **Ownership and Portability**:

- The Client retains full ownership of their data.
- Upon termination, the Hosting Provider will provide the Client with a
  complete export of their data in a mutually agreed format within 30 days.

4.5 **Indemnity**:
The Client shall indemnify and hold harmless the Hosting Provider against any
claims arising from the misuse of data or unauthorized access to the Client’s
systems.

---

## 5. Limitations of Liability

5.1 The Hosting Provider’s total liability under this SLA shall not exceed the
fees paid by the Client in the preceding 3 months.

5.2 The Hosting Provider shall not be liable for:

- Indirect, incidental, or consequential damages, including loss of profits,
  revenue, or data.
- Damages arising from third-party dependencies or Client-caused issues.

5.3 Liability for data breaches caused by malicious attacks is limited to
reasonable efforts to mitigate the breach.

5.4 Disputes shall be resolved via arbitration in Lisbon, Portugal with each
party bearing its own legal costs.

---

## 6. Governing Law and Jurisdiction

6.1 This SLA shall be governed by Portuguese law for services rendered by
Kartoza, LDA.

6.2 Any disputes shall be subject to binding arbitration under the rules of the
relevant jurisdiction.

---

## 7. Acceptance

Both parties agree to the terms of this SLA by signing below.

| Hosting Provider (Portugal)       | Client                                     |
|-----------------------------------|--------------------------------------------|
| Kartoza, LDA                      | [Client Name]                              |
| NIPC (Tax ID): 517404885          | Representative name: [Representative Name] |
| Registered Office:                |                                            |
| Bloco 1, Caixa 11, Vale de Rodão, |                                            |
| Distrito: Portalegre,             | Signature: [Signature]                     |
| Concelho: Marvão, Portugal        | Date: [Date]                               |
