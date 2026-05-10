---
tags: [frontend, performance, theory]
title: "Serving images at scale"
---
# Serving images at scale

## Why Bigger Images?

Modern devices have **high pixel density (DPI)** screens like Retina or 4K. Serving images incorrectly sized for these screens leads to:

- Blurry images
- Pixelation
- Poor UX

Serving correctly sized images improves:

- Sharpness and clarity
- Performance
- Loading speed and SEO

If image size is equals to CSS size → looks blurry on Retina. **Export images at 2x (or 1.5x minimum) CSS size.**

| Displayed (CSS) | Image (2x) |
| --- | --- |
| 200x200px | 400x400px |
| 500x300px | 1000x600px |
| 100x50px | 200x100px |

## Key Concepts

### Rendered Size (CSS Size)

- The size the image is **displayed** on the page, in **CSS pixels**.
- Controlled by CSS (`width`, `height`) or container layout (grid, flex, etc.).
- **Device-agnostic** (ignores pixel density).

### Intrinsic Size (Natural Size)

- The **actual pixel dimensions** of the image file.
- Stored in image metadata (e.g., 800x800px).
- Browsers scale the intrinsic image to fit the rendered size.

### Device Pixel Ratio (DPR)

- Ratio of **device pixels per CSS pixel**.
- Examples:
    - Standard screen: DPR = 1
    - Retina display: DPR = 2
    - High-end smartphones: DPR = 3 to 4

## How They Relate

```
Intrinsic Size = Rendered Size × Device Pixel Ratio (DPR)
```
