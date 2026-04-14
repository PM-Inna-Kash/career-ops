# Career-Ops: AI-Powered Job Search Orchestration (Optimized Fork)

[English](README.md) | [Русский](README.ru.md) | [Español](README.es.md)

<p align="center">
  <img src="docs/hero-banner.jpg" alt="Career-Ops — Multi-Agent Job Search System" width="800">
</p>

This is an optimized fork of the original [Career-Ops by santifer](https://github.com/santifer/career-ops). While the core intelligence remains, this version has been re-engineered to survive the "token limit" reality of heavy-duty job searching.

---

## 🏗 Operational Architecture & Optimization

As an **Operational Architect**, I refactored this pipeline to move beyond "toy" automation. The goal was to solve context dilution and the constant battle with hourly LLM limits during high-scale job hunting.

### 1. Context Sanitization Engine
Standard job boards serve descriptions wrapped in 15k–50k tokens of raw HTML and scripts. Sending this directly to an LLM is a "Token Tax" that leads to hallucinations and hits API limits instantly.
- **Implementation:** My pipeline strips all non-essential HTML, converting it into lean, high-signal Markdown.
- **Impact:** **96% reduction** in context usage (from 15,000 tokens of noise to ~500 tokens of pure signal). 

### 2. Tiered Model Routing (Unit Economics)
I implemented a tiered orchestration logic to optimize Total Cost of Ownership (TCO) and speed:
- **Tier 1 (Triage):** Uses **Claude 3 Haiku** for high-speed screening, initial JD evaluation, and gap analysis.
- **Tier 2 (Precision):** Uses **Claude 3.5 Sonnet** exclusively for the final, high-stakes CV tailoring and STAR story alignment.
- **Result:** **30x increase in efficiency**, zero "context window exceeded" errors, and significantly lower costs.

---

## 🔧 Optimization & Maintenance

This fork is maintained by **Inna Kashtanova**, an Operational Architect and Senior AI Product Manager. I specialize in taking raw AI workflows and making them production-ready by optimizing data flow and model economics for the Canadian tech market.

- **LinkedIn:** [Inna Kashtanova](https://linkedin.com/in/pminnaka)
- **Upwork Portfolio:** [Senior Product & Delivery Lead](https://www.upwork.com/freelancers/~01772147657d2a7090)
- **Personal Website:** [inna-kashtanova.com](https://inna-kashtanova.com)

*Original System by [santifer](https://github.com/santifer).*

---

## 🚀 Quick Start

1. **Clone and Install:**
   ```bash
   git clone [https://github.com/PM-Inna-Kash/career-ops.git](https://github.com/PM-Inna-Kash/career-ops.git)
   cd career-ops && npm install
   npx playwright install chromium
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env  # Add your API keys
   cp config/profile.example.yml config/profile.yml  # Add your professional details
   ```

3. **Add your CV:**
   Create `cv.md` in the project root with your resume in Markdown format.

4. **Run with Claude Code:**
   ```bash
   claude
   # Inside Claude Code:
   /career-ops {Paste Job URL}
   ```

---

## Features

| Feature | Description |
|---------|-------------|
| **Auto-Pipeline** | Paste a URL, get a full evaluation + Tailored PDF + Tracker entry |
| **6-Block Evaluation** | Role summary, CV match, level strategy, comp research, and STAR+R prep |
| **Smart PDF Gen** | ATS-optimized CVs generated in seconds via Playwright |
| **Batch Processing** | Parallel evaluation of multiple offers via sub-agents |
| **Dashboard TUI** | Terminal UI to browse and sort your application pipeline |
| **Efficiency Auditor** | Real-time tracking of token savings and context optimization log. |

## Project Structure

- `modes/` — Core logic and prompts (Refactored for Sanitization & Routing)
- `config/` — Your professional identity and search preferences
- `reports/` — Detailed AI analysis of every evaluated role
- `output/` — Tailored ATS-ready PDFs
- `data/` — Your tracking data (gitignored)

## Disclaimer

**Career-Ops is a local, open-source tool.** You control your data; nothing is stored on external servers except what you send to your chosen AI provider. The system never auto-submits. **Human-in-the-loop is mandatory.**

## License

MIT
```
