# Context_ Manga UI Architecture.pdf

## Page 1

Visual Reference for Developer Instance:
1. Layout Strategy: The UI is divided into 3 "Panels" using CSS Grid.
○ Panel 1 (Top Left): "The News". White background, jagged black border
(clip-path). Contains the Gemini-generated headline.
○ Panel 2 (Middle Right): "The Advisor". Halftone background (CSS
radial-gradient). Contains the character avatar (Vic or Sal) and their "Bonmot"
speech bubble.
○ Panel 3 (Bottom): "The Action". Black background. Two massive buttons: "YOLO"
(Green text) and "FOLD" (Red text).
2. CSS Halftone Code (Use this):
.manga-bg {
background-image: radial-gradient(#000 20%, transparent 20%), radial-gradient(#000
20%, transparent 20%);
background-color: #fff;
background-position: 0 0, 5px 5px;
background-size: 10px 10px;
opacity: 0.1;
}
```
3. Character Logic:
○ Do not try to generate complex AI images on the fly (too slow/expensive).
○ Use Silhouette Avatars: Pre-defined SVG paths for "Man in Suit" (Vic) and "Old
Man with Hat" (Sal). Change their color (Red/Green) based on the market mood.
