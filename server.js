// import express from "express";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "3mb" }));
// app.use(express.urlencoded({ extended: true, limit: "3mb" }));

// // --- /scan ---
// app.post("/scan", async (req, res) => {
//   try {
//     const { url } = req.body;
//     if (!url) return res.status(400).json({ error: "URL is required" });

//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     const importantTags = [
//       "button",
//       "a",
//       "input",
//       "textarea",
//       "select",
//       "form",
//       "header",
//       "nav",
//       "main",
//       "section",
//       "article",
//       "footer",
//     ];

//     function isImportant(el, $el) {
//       const tag = el.tagName;
//       const id = $el.attr("id");
//       const cls = $el.attr("class");

//       if (importantTags.includes(tag)) return true;
//       if (tag === "a" && !$el.attr("href")) return false;
//       if (tag === "input") {
//         const type = $el.attr("type");
//         return [
//           "text",
//           "email",
//           "password",
//           "submit",
//           "button",
//           "checkbox",
//           "radio",
//         ].includes(type);
//       }
//       if (["div", "span"].includes(tag)) return id || cls;
//       return false;
//     }

//     const elements = [];

//     $("*").each((i, el) => {
//       const $el = $(el);
//       if (!isImportant(el, $el)) return;

//       const cleanText = $el
//         .text()
//         .replace(/\s+/g, " ")
//         .replace(/\n+/g, " ")
//         .replace(/&nbsp;/g, " ")
//         .trim();

//       elements.push({
//         tag: el.tagName || "-",
//         id: $el.attr("id") || "-",
//         classes: $el.attr("class") || "-".replace(/\s+/g, " ").trim(),
//         text: $el.text().trim().slice(0, 60) || "-",
//       });
//     });

//     const structuredText = elements
//       .map(
//         (e) =>
//           `Tag: ${e.tag}, id: ${e.id}, classes: ${e.classes}, text: "${e.text}"`
//       )
//       .join("\n");

//     res.json({ structuredText });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to scan URL" });
//   }
// });

// // --- /generate (OpenRouter) ---
// app.post("/generate", async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     console.log("Prompt received:", prompt);
//     if (!prompt) return res.status(400).json({ error: "Prompt is required" });

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/completions",
//       {
//         model: "openai/gpt-4o",
//         //prompt: prompt,
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 1000,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
//         },
//       }
//     );

//     console.log("OpenRouter response data:", response.data);

//     const aiResult = response.data.choices[0].text;
//     res.json({ aiResult });
//   } catch (err) {
//     console.error(
//       "OpenRouter error:",
//       err.response?.status,
//       err.response?.data || err.message
//     );
//     res.status(500).json({ error: err.response?.data || err.message });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });
import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true, limit: "3mb" }));

// --- /scan ---
app.post("/scan", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const importantTags = [
      "button",
      "a",
      "input",
      "textarea",
      "select",
      "form",
      "header",
      "nav",
      "main",
      "section",
      "article",
      "footer",
    ];

    const elements = [];
    $("*").each((i, el) => {
      const $el = $(el);
      const tag = el.tagName;
      const id = $el.attr("id") || "-";
      const cls = $el.attr("class") || "-";

      if (
        importantTags.includes(tag) ||
        (["div", "span"].includes(tag) && (id !== "-" || cls !== "-")) ||
        (tag === "input" &&
          [
            "text",
            "email",
            "password",
            "submit",
            "button",
            "checkbox",
            "radio",
          ].includes($el.attr("type")))
      ) {
        const cleanText =
          $el.text().replace(/\s+/g, " ").trim().slice(0, 60) || "-";
        elements.push({ tag, id, classes: cls, text: cleanText });
      }
    });

    const structuredText = elements
      .map(
        (e) =>
          `Tag: ${e.tag}, id: ${e.id}, classes: ${e.classes}, text: "${e.text}"`
      )
      .join("\n");

    res.json({ structuredText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to scan URL" });
  }
});

// --- /generate ---
// app.post("/generate", async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ error: "Prompt is required" });

//     // --- OpenRouter Chat API ---
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-4o",
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 1000,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
//         },
//       }
//     );

//     const aiResult = response.data.choices[0].message.content;
//     res.json({ aiResult });
//   } catch (err) {
//     console.error(
//       "OpenRouter error:",
//       err.response?.status,
//       err.response?.data || err.message
//     );
//     res.status(500).json({ error: err.response?.data || err.message });
//   }
// });

// Статика
app.use(express.static(__dirname));
// для корня
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
