import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Use DEFAULT_MODEL env var to allow toggling model globally (fallback to gpt-5-mini)
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "gpt-5-mini";
console.log(`Using default model for completions: ${DEFAULT_MODEL}`);

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        succes: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article') `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    // Handle axios/OpenAI-style errors and surface upstream status
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      let body = error.response?.data || error.message;

      // If upstream returned an ArrayBuffer/Buffer, decode it to string
      try {
        if (body && typeof body !== "string" && (body.buffer || body.byteLength)) {
          body = Buffer.from(body).toString("utf8");
          try {
            body = JSON.parse(body);
          } catch (e) {
            // not JSON, leave as string
          }
        }
      } catch (e) {
        // ignore decoding errors
      }

      console.error("Upstream axios error (generateArticle):", status, body);
      return res.status(status).json({ success: false, message: body });
    }

    console.error("generateArticle error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        succes: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title') `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      let body = error.response?.data || error.message;
      try {
        if (body && typeof body !== "string" && (body.buffer || body.byteLength)) {
          body = Buffer.from(body).toString("utf8");
          try {
            body = JSON.parse(body);
          } catch (e) {}
        }
      } catch (e) {}

      console.error("Upstream axios error (generateBlogTitle):", status, body);
      return res.status(status).json({ success: false, message: body });
    }

    console.error("generateBlogTitle error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        succes: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ?? false
    }) `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    // Surface axios errors with upstream status/code when available
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      let body = error.response?.data || error.message;
      try {
        if (body && typeof body !== "string" && (body.buffer || body.byteLength)) {
          body = Buffer.from(body).toString("utf8");
          try {
            body = JSON.parse(body);
          } catch (e) {}
        }
      } catch (e) {}

      console.error("Upstream axios error (generateImage):", status, body);
      return res.status(status).json({ success: false, message: body });
    }

    console.error("generateImage error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clipdropHealth = async (req, res) => {
  try {
    // Make a minimal request to ClipDrop to check API key and credit status.
    // Some ClipDrop responses include billing info when credits are exhausted.
    const formData = new FormData();
    formData.append("prompt", "health check");

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        // ask for JSON so we can read any error body; API may still return arraybuffer on success
        responseType: "json",
        validateStatus: () => true,
      }
    );

    let body = response.data;
    // If body is an ArrayBuffer-ish, decode
    try {
      if (body && typeof body !== "string" && (body.buffer || body.byteLength)) {
        body = Buffer.from(body).toString("utf8");
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }
    } catch (e) {}

    return res.status(response.status).json({ success: response.status === 200, status: response.status, body });
  } catch (error) {
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      let body = error.response?.data || error.message;
      try {
        if (body && typeof body !== "string" && (body.buffer || body.byteLength)) {
          body = Buffer.from(body).toString("utf8");
          try {
            body = JSON.parse(body);
          } catch (e) {}
        }
      } catch (e) {}

      return res.status(status).json({ success: false, message: body });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        succes: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image') `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        succes: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image') `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        succes: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review') `;

    res.json({ success: true, content });
  } catch (error) {
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      let body = error.response?.data || error.message;
      try {
        if (body && typeof body !== "string" && (body.buffer || body.byteLength)) {
          body = Buffer.from(body).toString("utf8");
          try {
            body = JSON.parse(body);
          } catch (e) {}
        }
      } catch (e) {}

      console.error("Upstream axios error (resumeReview):", status, body);
      return res.status(status).json({ success: false, message: body });
    }

    console.error("resumeReview error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
