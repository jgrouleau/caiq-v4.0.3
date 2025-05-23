---
layout: default
title: Welcome to the UNOFFICIAL CAIQ v4.0.3
---

{% assign first_domain = site.data.domains | first %}
{% assign first_domain_title = first_domain.name %}
{% assign first_domain_questions = first_domain.question_page %}

# Welcome to the UNOFFICIAL Cloud Security Alliance (CSA) CAIQ v4.0.3

The Consensus Assessments Initiative Questionnaire (CAIQ) is a tool created by the [Cloud Security Alliance](https://cloudsecurityalliance.org) (CSA) for cloud consumers and auditors to assess the security capabilities of cloud providers.

The official CAIQ is available from the CSA as an [Excel spreadsheet](https://cloudsecurityalliance.org/artifacts/cloud-controls-matrix-v4/). However, I personally greatly dislike spreadsheet-based tools and decided to have a go at creating an online version of the questionnaire. This online version allows you to:

- Complete the questionnaire one question at a time question, to reduce visual clutter
- Locally save your progress automatically - nothing is saved server-side or in any database
- Export your completed questionnaire as a PDF
- Review and modify your answers at any time, due to the local storage

> IMPORTANT! This is a personal project made for fun to learn and play around with Agentic AI (using Cursor), GitHub Pages, and Jekyll. This assessment CANNOT be used to submit your CAIQ to the STAR Registry. No copyright infringement is intended with this educational project.

## Getting Started

1. Review the [domains]({{ '/domains' | relative_url }}) to understand the scope of the assessment
2. Begin with **{{ first_domain_title }}**
3. Complete each section at your own pace
4. Automatically save your progress as you go
5. Export your final responses when complete

## About CAIQ v4.0.3

The CAIQ provides a set of yes/no questions a cloud consumer and cloud auditor may wish to ask of a cloud provider. It incorporates, where applicable, the recommendations specified in the CSA's Security Guidance for Critical Areas of Focus in Cloud Computing and the Cloud Controls Matrix (CCM).

[Start Assessment]({{ first_domain_questions | relative_url }}) 