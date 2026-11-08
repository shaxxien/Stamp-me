// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
var DATA_DIR = path.resolve(__dirname, "data");
var MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
var SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var INITIAL_SETTINGS = {
  ownerPin: "medtech123",
  recipientTitle: "The Bridge Keeper (Clinical Lab Intern / Officer)",
  siteHeadline: "The stamp bridge",
  siteSubtitle: "Where unspoken thoughts from the laboratory find quiet passage.",
  heroIntro: "Behind every centrifuge spin, emergency blood crossmatch, and late-night slide differential, Medical Technology students shoulder an immense, invisible burden. From trembling hands during first phlebotomies to the quiet dread of board exam preparation, much of what you feel remains unspoken in the laboratory ward.",
  purposeText: "The Stamp Bridge is an intimate, anonymous sanctuary built exclusively for MedTech students. Drop an anonymous stamp with your honest confessions, duty vents, or questions. You are issued a private Secret Retrieval Code so only you can return and read the personal reply waiting for you on the other side.",
  welcomeNote: "Welcome to The Stamp Bridge. Whether you just survived a 16-hour blood bank duty, failed a slide exam, or just need to say something you could never say out loud in the lab \u2014 drop your stamp here. I read every letter and reply privately.",
  allowPublicJournal: true,
  theme: {
    palette: "sage",
    primaryColor: "#3B5337",
    primaryDark: "#2A3A29",
    bgColor: "#F8FAF7",
    cardColor: "#FFFFFF",
    borderColor: "#CFDBCB",
    fontStyle: "editorial",
    paperTexture: "ruled",
    stampBorder: "perforated"
  }
};
var INITIAL_MESSAGES = [
  {
    id: "stamp_demo_01",
    accessCode: "STAMP-MED1",
    category: "duty_shift",
    stampDesign: "hematology_slide",
    senderAlias: "Third-Year Intern on Night Duty",
    recipientName: "The Bridge Keeper",
    content: "It was 3:30 AM in the ER lab and we had three code red traumas at once. My hands were shaking while doing the emergency crossmatching. Nobody noticed I almost cried behind the centrifuge. I just needed to tell someone who understands how heavy that glass tube feels.",
    createdAt: new Date(Date.now() - 36e5 * 26).toISOString(),
    status: "replied",
    pinned: true,
    archived: false,
    replies: [
      {
        id: "reply_demo_01",
        sender: "owner",
        content: "Your hands may have been trembling, but you still spun those tubes and kept those patients safe. Crossmatching under code red adrenaline is something only another MedTech can truly comprehend. Take a deep breath, get some warm tea, and be proud of yourself tonight. You did incredible.",
        createdAt: new Date(Date.now() - 36e5 * 18).toISOString()
      }
    ]
  },
  {
    id: "stamp_demo_02",
    accessCode: "STAMP-BIO2",
    category: "board_exam",
    stampDesign: "gram_negative",
    senderAlias: "Graduating MedTech Senior",
    recipientName: "The Bridge Keeper",
    content: "Review season is suffocating. I keep mixing up biochemical reactions of Enterobacteriaceae (TSI, IMViC, urease). What if I let my parents down? Sending this out into the ether hoping for a little sign that things will be okay.",
    createdAt: new Date(Date.now() - 36e5 * 8).toISOString(),
    status: "replied",
    pinned: false,
    archived: false,
    replies: [
      {
        id: "reply_demo_02",
        sender: "owner",
        content: "Take it one test tube at a time! Even veteran chief medical technologists still double-check their charts for lactose fermentation and citrate. Your worth as a scientist and human is not defined by one practice test. Trust the muscle memory of all those sleepless library nights. You will cross this bridge into RMT status.",
        createdAt: new Date(Date.now() - 36e5 * 4).toISOString()
      }
    ]
  }
];
function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading settings file:", e);
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(INITIAL_SETTINGS, null, 2));
  return INITIAL_SETTINGS;
}
function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}
function getMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading messages file:", e);
  }
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(INITIAL_MESSAGES, null, 2));
  return INITIAL_MESSAGES;
}
function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}
function generateAccessCode() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `STAMP-${rand}`;
}
app.get("/api/public-stats", (_req, res) => {
  const messages = getMessages().filter((m) => !m.archived);
  const settings = getSettings();
  const totalReceived = messages.length;
  const totalReplied = messages.filter((m) => m.status === "replied").length;
  res.json({
    recipientTitle: settings.recipientTitle || INITIAL_SETTINGS.recipientTitle,
    siteHeadline: settings.siteHeadline || INITIAL_SETTINGS.siteHeadline,
    siteSubtitle: settings.siteSubtitle || INITIAL_SETTINGS.siteSubtitle,
    heroIntro: settings.heroIntro || INITIAL_SETTINGS.heroIntro,
    purposeText: settings.purposeText || INITIAL_SETTINGS.purposeText,
    welcomeNote: settings.welcomeNote || INITIAL_SETTINGS.welcomeNote,
    allowPublicJournal: settings.allowPublicJournal ?? true,
    theme: settings.theme || INITIAL_SETTINGS.theme,
    totalReceived,
    totalReplied,
    activeStampsCount: messages.length
  });
});
app.post("/api/messages", (req, res) => {
  const { category, stampDesign, senderAlias, recipientName, content } = req.body;
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    res.status(400).json({ error: "Message content is required." });
    return;
  }
  const messages = getMessages();
  let accessCode = generateAccessCode();
  while (messages.some((m) => m.accessCode === accessCode)) {
    accessCode = generateAccessCode();
  }
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    accessCode,
    category: category || "general",
    stampDesign: stampDesign || "eucalyptus_lab",
    senderAlias: senderAlias?.trim() || "Anonymous MedTech",
    recipientName: recipientName?.trim() || "The Bridge Keeper",
    content: content.trim(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "delivered",
    replies: [],
    pinned: false,
    archived: false
  };
  messages.unshift(newMessage);
  saveMessages(messages);
  res.status(201).json({
    success: true,
    accessCode: newMessage.accessCode,
    id: newMessage.id,
    message: "Your stamp has crossed the bridge safely. Keep your Secret Stamp Code safe to check for your private reply."
  });
});
app.get("/api/messages/track/:accessCode", (req, res) => {
  const code = req.params.accessCode?.trim().toUpperCase();
  const messages = getMessages();
  const found = messages.find((m) => m.accessCode.toUpperCase() === code);
  if (!found) {
    res.status(404).json({ error: "No stamp letter found with this code. Please verify the code." });
    return;
  }
  res.json({
    accessCode: found.accessCode,
    category: found.category,
    stampDesign: found.stampDesign,
    senderAlias: found.senderAlias,
    recipientName: found.recipientName,
    content: found.content,
    createdAt: found.createdAt,
    status: found.status,
    replies: found.replies
  });
});
app.post("/api/messages/track/:accessCode/reply", (req, res) => {
  const code = req.params.accessCode?.trim().toUpperCase();
  const { content } = req.body;
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    res.status(400).json({ error: "Reply text is required." });
    return;
  }
  const messages = getMessages();
  const index = messages.findIndex((m) => m.accessCode.toUpperCase() === code);
  if (index === -1) {
    res.status(404).json({ error: "Letter thread not found." });
    return;
  }
  const newReply = {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    sender: "sender",
    content: content.trim(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  messages[index].replies.push(newReply);
  messages[index].status = "delivered";
  saveMessages(messages);
  res.json({ success: true, reply: newReply });
});
function verifyOwnerAuth(req, res, next) {
  const pinHeader = req.headers["x-owner-pin"];
  const settings = getSettings();
  if (!pinHeader || pinHeader !== settings.ownerPin) {
    res.status(401).json({ error: "Unauthorized: Invalid or missing owner PIN." });
    return;
  }
  next();
}
app.post("/api/owner/auth", (req, res) => {
  const { pin } = req.body;
  const settings = getSettings();
  if (pin === settings.ownerPin) {
    res.json({
      success: true,
      recipientTitle: settings.recipientTitle,
      welcomeNote: settings.welcomeNote
    });
  } else {
    res.status(401).json({ error: "Incorrect PIN. Please try again." });
  }
});
app.post("/api/owner/settings", verifyOwnerAuth, (req, res) => {
  const { newPin, recipientTitle, welcomeNote, siteHeadline, siteSubtitle, heroIntro, purposeText, allowPublicJournal, theme } = req.body;
  const settings = getSettings();
  if (newPin && typeof newPin === "string" && newPin.trim().length >= 4) {
    settings.ownerPin = newPin.trim();
  }
  if (recipientTitle && typeof recipientTitle === "string") {
    settings.recipientTitle = recipientTitle.trim();
  }
  if (welcomeNote && typeof welcomeNote === "string") {
    settings.welcomeNote = welcomeNote.trim();
  }
  if (siteHeadline && typeof siteHeadline === "string" && siteHeadline.trim()) {
    settings.siteHeadline = siteHeadline.trim();
  }
  if (siteSubtitle && typeof siteSubtitle === "string") {
    settings.siteSubtitle = siteSubtitle.trim();
  }
  if (heroIntro && typeof heroIntro === "string") {
    settings.heroIntro = heroIntro.trim();
  }
  if (purposeText && typeof purposeText === "string") {
    settings.purposeText = purposeText.trim();
  }
  if (typeof allowPublicJournal === "boolean") {
    settings.allowPublicJournal = allowPublicJournal;
  }
  if (theme && typeof theme === "object") {
    settings.theme = theme;
  }
  saveSettings(settings);
  res.json({ success: true, message: "Settings and website content updated successfully.", settings });
});
app.post("/api/owner/theme", verifyOwnerAuth, (req, res) => {
  const { theme } = req.body;
  if (!theme || typeof theme !== "object") {
    res.status(400).json({ error: "Valid theme object is required" });
    return;
  }
  const settings = getSettings();
  settings.theme = theme;
  saveSettings(settings);
  res.json({ success: true, message: "Theme design updated live!", theme: settings.theme });
});
app.get("/api/owner/messages", verifyOwnerAuth, (_req, res) => {
  const messages = getMessages();
  res.json({ messages });
});
app.post("/api/owner/messages/:id/reply", verifyOwnerAuth, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    res.status(400).json({ error: "Reply text cannot be empty." });
    return;
  }
  const messages = getMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Message not found." });
    return;
  }
  const reply = {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    sender: "owner",
    content: content.trim(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  messages[index].replies.push(reply);
  messages[index].status = "replied";
  saveMessages(messages);
  res.json({ success: true, reply, message: messages[index] });
});
app.patch("/api/owner/messages/:id/read", verifyOwnerAuth, (req, res) => {
  const { id } = req.params;
  const messages = getMessages();
  const item = messages.find((m) => m.id === id);
  if (item && item.status === "delivered") {
    item.status = "read";
    saveMessages(messages);
  }
  res.json({ success: true });
});
app.patch("/api/owner/messages/:id/pin", verifyOwnerAuth, (req, res) => {
  const { id } = req.params;
  const messages = getMessages();
  const item = messages.find((m) => m.id === id);
  if (item) {
    item.pinned = !item.pinned;
    saveMessages(messages);
    res.json({ success: true, pinned: item.pinned });
  } else {
    res.status(404).json({ error: "Message not found" });
  }
});
app.patch("/api/owner/messages/:id/archive", verifyOwnerAuth, (req, res) => {
  const { id } = req.params;
  const messages = getMessages();
  const item = messages.find((m) => m.id === id);
  if (item) {
    item.archived = !item.archived;
    saveMessages(messages);
    res.json({ success: true, archived: item.archived });
  } else {
    res.status(404).json({ error: "Message not found" });
  }
});
app.delete("/api/owner/messages/:id", verifyOwnerAuth, (req, res) => {
  const { id } = req.params;
  let messages = getMessages();
  const initialLength = messages.length;
  messages = messages.filter((m) => m.id !== id);
  if (messages.length === initialLength) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  saveMessages(messages);
  res.json({ success: true, message: "Message permanently removed." });
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The stamp bridge server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
