"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Copy, Check, Eye, Code, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface AINewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
}

interface StockHighlight {
  id: string;
  text: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function generateNewsletterHTML(
  aiNews: AINewsItem[],
  stockHighlights: StockHighlight[],
  date: string
): string {
  const aiNewsHTML = aiNews
    .filter((item) => item.title.trim() || item.summary.trim())
    .map(
      (item) => `
        <tr>
          <td style="padding: 0 0 24px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px;">
              <tr>
                <td style="padding: 20px;">
                  <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #1a1a1a; line-height: 1.4;">
                    ${item.title}
                  </h3>
                  <p style="margin: 0; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
                    ${item.summary}
                  </p>
                  ${
                    item.source.trim()
                      ? `<p style="margin: 12px 0 0 0; font-size: 13px; color: #6b7280;">
                      Source: <a href="${item.source}" style="color: #2563eb; text-decoration: none;">${item.source}</a>
                    </p>`
                      : ""
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join("");

  const stockHighlightsHTML = stockHighlights
    .filter((item) => item.text.trim())
    .map(
      (item) => `
        <tr>
          <td style="padding: 0 0 12px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="8" style="vertical-align: top; padding-top: 8px;">
                  <div style="width: 6px; height: 6px; background-color: #2563eb; border-radius: 50%;"></div>
                </td>
                <td style="padding-left: 12px;">
                  <p style="margin: 0; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
                    ${item.text}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Newsletter - ${date}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                Weekly Newsletter
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af;">
                ${date}
              </p>
            </td>
          </tr>

          <!-- AI News Section -->
          ${
            aiNewsHTML
              ? `
          <tr>
            <td style="padding: 40px 40px 0 40px;">
              <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 700; color: #1a1a1a; border-bottom: 2px solid #2563eb; padding-bottom: 12px;">
                AI News
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${aiNewsHTML}
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Stock Market Section -->
          ${
            stockHighlightsHTML
              ? `
          <tr>
            <td style="padding: 40px 40px 0 40px;">
              <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 700; color: #1a1a1a; border-bottom: 2px solid #10b981; padding-bottom: 12px;">
                Stock Market Highlights
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${stockHighlightsHTML}
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Footer -->
          <tr>
            <td style="padding: 40px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 40px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">
                Thank you for reading!
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                <a href="{{unsubscribe}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function NewsletterClient() {
  const [aiNews, setAINews] = React.useState<AINewsItem[]>([
    { id: generateId(), title: "", summary: "", source: "" },
  ]);
  const [stockHighlights, setStockHighlights] = React.useState<StockHighlight[]>(
    [{ id: generateId(), text: "" }]
  );
  const [generatedHTML, setGeneratedHTML] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<"editor" | "preview" | "html">("editor");
  const [isCopied, setIsCopied] = React.useState(false);

  const addAINewsItem = () => {
    setAINews([...aiNews, { id: generateId(), title: "", summary: "", source: "" }]);
  };

  const removeAINewsItem = (id: string) => {
    if (aiNews.length > 1) {
      setAINews(aiNews.filter((item) => item.id !== id));
    }
  };

  const updateAINewsItem = (id: string, field: keyof AINewsItem, value: string) => {
    setAINews(
      aiNews.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addStockHighlight = () => {
    setStockHighlights([...stockHighlights, { id: generateId(), text: "" }]);
  };

  const removeStockHighlight = (id: string) => {
    if (stockHighlights.length > 1) {
      setStockHighlights(stockHighlights.filter((item) => item.id !== id));
    }
  };

  const updateStockHighlight = (id: string, text: string) => {
    setStockHighlights(
      stockHighlights.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const generateNewsletter = () => {
    const today = new Date();
    const dateString = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const html = generateNewsletterHTML(aiNews, stockHighlights, dateString);
    setGeneratedHTML(html);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHTML);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleGenerateAndPreview = () => {
    generateNewsletter();
    setActiveTab("preview");
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Newsletter Generator</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create HTML newsletters for Beehiiv
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("editor")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "editor"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <PenLine className="h-4 w-4" />
          Editor
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "preview"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
        <button
          onClick={() => setActiveTab("html")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "html"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Code className="h-4 w-4" />
          HTML
        </button>
      </div>

      {/* Editor Tab */}
      {activeTab === "editor" && (
        <div className="space-y-6">
          {/* AI News Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI News</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiNews.map((item, index) => (
                <div
                  key={item.id}
                  className="space-y-4 rounded-lg border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      News Item {index + 1}
                    </span>
                    {aiNews.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAINewsItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    label="Title"
                    placeholder="Enter news title..."
                    value={item.title}
                    onChange={(e) =>
                      updateAINewsItem(item.id, "title", e.target.value)
                    }
                  />
                  <Textarea
                    label="Summary"
                    placeholder="Enter news summary..."
                    value={item.summary}
                    onChange={(e) =>
                      updateAINewsItem(item.id, "summary", e.target.value)
                    }
                  />
                  <Input
                    label="Source URL (optional)"
                    placeholder="https://..."
                    value={item.source}
                    onChange={(e) =>
                      updateAINewsItem(item.id, "source", e.target.value)
                    }
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addAINewsItem} className="w-full">
                <Plus className="h-4 w-4" />
                Add News Item
              </Button>
            </CardContent>
          </Card>

          {/* Stock Market Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stock Market Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stockHighlights.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Textarea
                      label={`Highlight ${index + 1}`}
                      placeholder="Enter stock market highlight..."
                      value={item.text}
                      onChange={(e) => updateStockHighlight(item.id, e.target.value)}
                    />
                  </div>
                  {stockHighlights.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStockHighlight(item.id)}
                      className="mt-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addStockHighlight}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                Add Highlight
              </Button>
            </CardContent>
          </Card>

          <Button variant="accent" onClick={handleGenerateAndPreview} className="w-full">
            Generate Newsletter
          </Button>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          {generatedHTML ? (
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <iframe
                  srcDoc={generatedHTML}
                  className="w-full h-[700px] bg-white"
                  title="Newsletter Preview"
                />
              </div>
              <Button
                variant="accent"
                onClick={copyToClipboard}
                className="w-full"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy HTML to Clipboard
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground text-sm">
                Fill in the form in the Editor tab and click &quot;Generate Newsletter&quot;
              </p>
            </div>
          )}
        </div>
      )}

      {/* HTML Tab */}
      {activeTab === "html" && (
        <div className="space-y-4">
          {generatedHTML ? (
            <>
              <pre className="rounded-lg border border-border bg-muted p-4 overflow-auto max-h-[700px] text-xs">
                <code>{generatedHTML}</code>
              </pre>
              <Button
                variant="accent"
                onClick={copyToClipboard}
                className="w-full"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy HTML to Clipboard
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground text-sm">
                Fill in the form in the Editor tab and click &quot;Generate Newsletter&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
