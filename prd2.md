Perfect. Now we'll continue with the **industry-level PRD**. This section is what Antigravity will rely on to generate the frontend, UX, and user flows.

---

# 26. Complete Information Architecture

```
Home
│
├── Login
├── Register
├── Forgot Password
│
└── Dashboard
      │
      ├── Health Dashboard
      ├── AI Symptom Assessment
      ├── Disease Prediction
      ├── Medical Image Scanner
      ├── AI Health Assistant
      ├── Disease Knowledge Base
      ├── Medicine Information
      ├── Personalized Preventive Care
      ├── Emergency Risk Center
      ├── Nearby Hospitals
      ├── Health Reports
      ├── Health History
      ├── Profile
      ├── Settings
      ├── Notifications
      └── Help Center
```

---

# 27. UI/UX Design Philosophy

The application should feel like a **premium AI healthcare platform**, inspired by:

* Apple Health
* Google Gemini
* ChatGPT
* Microsoft Fluent Design
* Modern hospital dashboards

### Design Keywords

* Minimal
* Professional
* Calm
* Clean
* Accessible
* Trustworthy
* AI-first

---

# 28. Design System

## Color Palette

Primary Blue

```
#2563EB
```

Medical Teal

```
#14B8A6
```

Success

```
#22C55E
```

Warning

```
#F59E0B
```

Danger

```
#EF4444
```

Background

```
#F8FAFC
```

Dark Mode Background

```
#0F172A
```

Cards

```
White
```

Text

```
Slate Gray
```

---

## Typography

Headings

**Poppins Bold**

Body

**Inter**

Buttons

**Inter SemiBold**

---

## Border Radius

Cards

```
20px
```

Buttons

```
14px
```

Inputs

```
14px
```

---

## Shadows

Soft Glass Shadow

```
0 10 30 rgba(0,0,0,.08)
```

Hover Shadow

```
0 20 40 rgba(0,0,0,.12)
```

---

## Animations

Fade In

Slide Up

Glass Blur

Hover Lift

Button Ripple

Loading Skeleton

Typing Animation

Gradient Glow

Smooth Page Transition

---

# 29. Landing Page

## Hero

Large illustration

Doctor + AI

Headline

> AI-Powered Healthcare for Smarter Health Decisions

Subheading

> Understand symptoms, assess health risks, analyze medical images, and receive personalized preventive healthcare recommendations.

Buttons

Start Assessment

Explore Features

---

### Feature Cards

AI Symptom Assessment

Medical Image Scanner

AI Healthcare Assistant

Disease Risk Prediction

Health Reports

Hospital Finder

---

### Statistics

Diseases Covered

Symptoms Covered

Image Categories

Average Assessment Time

---

### How It Works

Step 1

Describe symptoms

↓

Step 2

AI analyzes

↓

Step 3

Risk Assessment

↓

Step 4

Recommendations

↓

Step 5

Health Report

---

### Testimonials

(Static Demo)

---

### FAQ

10 Questions

---

### Footer

Privacy

Terms

Contact

GitHub

LinkedIn

---

# 30. Login Page

Minimal

Medical Illustration

Email

Password

Remember Me

Forgot Password

Login

Google Login

Create Account

---

# 31. Registration

Full Name

Email

Phone

Password

Confirm Password

Age

Gender

Country

Agree to Terms

Register

---

# 32. Dashboard

Large Welcome Card

Health Score

Recent Reports

Quick Actions

Today's Health Tip

Emergency Shortcut

Risk Summary

AI Assistant Card

Charts

Recent Notifications

---

Quick Actions Grid

AI Assessment

Upload Image

AI Chat

Reports

History

Hospitals

---

# 33. Symptom Assessment

Progress Wizard

Step 1

Basic Information

Age

Gender

Height

Weight

BMI Auto Calculate

Lifestyle

Smoking

Alcohol

Exercise

---

Step 2

Symptoms

Search Box

Autocomplete

Severity Slider

Body Part Selection

Pain Level

Temperature

Blood Pressure (optional)

Heart Rate (optional)

Duration

---

Step 3

Medical History

Diabetes

Hypertension

Asthma

Heart Disease

Pregnancy

Allergies

Current Medication

Family History

---

Step 4

Review

Submit

---

Loading Animation

"Analyzing symptoms..."

---

# 34. Disease Prediction Result

Hero Card

Most Likely Condition

Confidence Score

Risk Level

Probability Meter

---

Tabs

Overview

Symptoms

Causes

Prevention

Lifestyle

Diet

Doctor Advice

---

Top Predictions

1

Influenza

89%

2

COVID-19

81%

3

Common Cold

77%

4

Bronchitis

71%

5

Pneumonia

64%

---

Explainability

Matched Symptoms

Missing Symptoms

Reasoning

Confidence Explanation

---

Severity Meter

🟢 Low

🟡 Medium

🟠 High

🔴 Emergency

---

Recommended Actions

Drink Water

Rest

Consult Physician

Emergency Care

---

# 35. Medical Image Scanner

Upload

or

Take Photo

Supported Images

Skin

Eye

Tongue

Nails

Wounds

Rashes

---

AI Analysis

Image Quality

Confidence

Detected Condition

Heatmap Overlay

Explanation

---

Recommendations

---

Download Report

---

# 36. AI Healthcare Assistant

ChatGPT-like Interface

Features

Typing Animation

Voice Input

Image Upload

Suggested Questions

Conversation Memory

Markdown Support

---

Suggested Prompts

Explain Diabetes

Why do I have headaches?

Foods for anemia

Medicine side effects

Prevent dengue

---

# 37. Health Dashboard

Health Score

BMI

Water Intake

Sleep Hours

Exercise

Risk Trend

History

Charts

Pie Charts

Bar Charts

Timeline

Achievements

---

# 38. Health Reports

Generate PDF

Contains

Logo

Patient Info

Symptoms

Prediction

Risk

Recommendations

Diet

Doctor Notes

QR Code

Timestamp

---

Share

Download

Print

---

# 39. Nearby Hospitals

Interactive Map

Current Location

Hospitals

Government

Private

Emergency

24 Hours

Distance

Directions

Phone Number

---

# 40. Emergency Center

Large Red Card

Emergency Detected

Reason

Immediate Actions

Emergency Numbers

Nearest Hospital

First Aid Instructions

Call Button (future)

---

# 41. Disease Knowledge Base

Search Disease

Cards

Overview

Symptoms

Causes

Stages

Risk

Diagnosis

General Treatment Information

Recovery

Prevention

Frequently Asked Questions

---

# 42. Medicine Information

Search Medicine

Displays

Generic Name

Brand Names

Uses

Common Dosage Information

Side Effects

Interactions

Storage

Warnings

This section must clearly state that the information is educational and users should follow a healthcare professional's advice for treatment decisions.

---

# 43. Preventive Healthcare

Personalized Based On

Age

Lifestyle

Medical History

Prediction

Shows

Diet

Water Intake

Exercise

Sleep

Vaccinations

Lifestyle Improvements

Health Tips

---

## Next Section (Part 3)

The next part of the PRD should cover the technical implementation in depth, including:

* Complete database schema (40+ tables and relationships)
* Backend architecture (FastAPI)
* Frontend architecture (React + Tailwind)
* AI/ML pipeline
* APIs (50+ endpoints)
* Authentication and authorization
* File storage
* Deployment
* Admin panel
* Folder structure
* Development roadmap (12-week milestone plan)

These technical specifications will make the PRD detailed enough for Antigravity to generate a production-style application.
