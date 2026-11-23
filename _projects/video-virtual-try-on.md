---
layout: default
title: Video Virtual Try-On
permalink: /projects/video-virtual-try-on/
description: I built and trained the animation stage of a video try-on prototype. My model transfers motion from a driving video to the person in a dressed reference image.
importance: 1
featured: true
img: /assets/video/virtual-try-on/studio-trousers-cover.webp
img_alt: The woman in green who provides the motion, beside the generated result with a white blouse and beige trousers
cases:
  # Archive pair 00032 to 00043. The input still comes from the earlier Eevee try-on.
  - id: omnitryon-red-dress
    group: My reproductions
    label: OmniTryOn
    heading: The hem stays short
    note: The edited frame I gave OmniTryOn had the color of the long red dress and the short hem of the original floral dress. The hem stayed above the knee when the wearer turned.
    path: /assets/video/virtual-try-on/omnitryon-red-dress/
    inputs:
      - { file: garment, label: Target garment, alt: A red V-neck dress with a long flared skirt. }
      - { file: late, label: Output at 3.2 s, alt: The red dress ends above the knee as the wearer turns away. }
    earlier:
      - { file: source, label: Source frame, alt: The wearer faces forward in a short floral dress. }
      - { file: early, label: Output at 0 s, alt: The edited starting frame already shows a short red dress. }
    duration: 3.3
  # ViViD source 1219160, garment 1237031, full-length 1954 run.
  - id: vivid-lace-blouse
    group: My reproductions
    label: ViViD
    heading: The original collar shows through
    note: I tried replacing a navy blazer and red turtleneck with a white lace blouse. Part of the blazer remains beside the wearer’s hand. When she turns, the red collar is visible above the lace.
    path: /assets/video/virtual-try-on/vivid-lace-blouse/
    inputs:
      - { file: garment, label: Target garment, alt: A white short-sleeved lace blouse with a scalloped hem. }
      - { file: late, label: Output at 7.6 s, alt: A bright red collar is visible above the white lace neckline. }
    earlier:
      - { file: source, label: Source frame, alt: The wearer holds her navy blazer open over a red turtleneck. }
      - { file: early, label: Output at 3.8 s, alt: A dark flap of the original blazer remains beside her hand. }
    duration: 7.7
    garment_source: https://huggingface.co/datasets/alibaba-yuanjing-aigclab/ViViD/tree/main
  - id: coat-sleeves
    group: Commercial demos
    label: Coat
    heading: One forearm stays bare
    note: The reference coat has two long sleeves. In the edited frame, one reaches the wrist and the other ends above the elbow.
    path: /assets/img/virtual-try-on/coat-sleeves/
    swatch: { label: Target coat, width: 60, height: 72, alt: The selected burgundy coat has full-length sleeves on both sides. }
    inputs:
      - { file: source, label: Input frame, width: 560, height: 535, alt: The wearer holds both arms across a black T-shirt. }
      - { file: result, label: Edited frame, width: 560, height: 535, alt: The burgundy coat covers one forearm and leaves the other bare. }
  # driving.mp4, decoded frame 48 (zero-based), presentation timestamp 1.6016 s.
  - id: ultraman
    legacy_id: armor-waist
    group: Commercial demos
    label: Ultraman
    heading: The original skirt stays visible
    note: The target is a full-length Ultraman suit. Below the silver belt, the edited frame still shows the black tulle skirt from the driving video.
    path: /assets/img/virtual-try-on/armor-waist/
    swatch: { label: Target suit, width: 116, height: 117, alt: The selected red and silver Ultraman suit includes matching legs. }
    inputs:
      - {
          file: source,
          label: Closest driving frame (1.60 s),
          width: 576,
          height: 768,
          alt: The dancer reaches forward in a beige crop top and black tulle skirt.,
        }
      - {
          file: result,
          label: Demo screenshot,
          width: 576,
          height: 768,
          alt: The dancer reaches forward in a red and silver Ultraman top over the black skirt.,
        }
---

<article class="video-virtual-try-on">
  <header class="try-on-hero">
    <div class="try-on-intro">
      <a class="try-on-back" href="{{ '/projects/' | relative_url }}"><span aria-hidden="true">←</span> Projects</a>
      <h1>{{ page.title | replace: 'Try-On', '<span>Try-On</span>' }}</h1>
      <p>{{ page.description }}</p>
    </div>
    {% include try-on-video.liquid
      file="studio-trousers" title="UBC-Fashion" preload="metadata"
      caption="I animated a still of the woman in the white blouse and beige trousers. The motion comes from a training clip of the woman in green."
    %}
  </header>

  <section class="try-on-section" aria-labelledby="approach-title">
    <div class="try-on-section-intro">
      <h2 id="approach-title">Why I start with a still image</h2>
      <p>When I tested video try-on methods, a new color or print often came through while the cut still matched the old outfit. I designed the pipeline around a single dressed image so I could check the garment’s cut before animating the wearer.</p>
    </div>
    <dl class="try-on-stages">
      <div>
        <dt>Image try-on</dt>
        <dd>Person photo + garment image <span aria-hidden="true">→</span> <strong>dressed reference</strong></dd>
      </div>
      <div>
        <dt>Human animation</dt>
        <dd>Dressed reference + driving video <span aria-hidden="true">→</span> <strong>try-on video</strong></dd>
      </div>
    </dl>
    {% include try-on-comparisons.liquid %}
  </section>

  <section class="try-on-section try-on-reading" aria-labelledby="animation-route">
    <h2 id="animation-route">Why I switched to IM-Animation</h2>
    <div>
      <p>I considered explicit controls such as a 2D skeleton or an SMPL body mesh. I chose an implicit encoder that learns motion from video so the same reach could adapt to different arm lengths.</p>
      <p>I first trained an end-to-end model following X-UniMotion. Even after I reworked the motion retargeter, it struggled to follow the driver’s gestures with the data and compute I had. I switched to IM-Animation so I could train the retargeter before fine-tuning the video generator.</p>
      <p>Drawing on both papers, I built separate paths for appearance and motion on the Wan2.2-TI2V-5B backbone. I gave the dressed image its own reference tokens and fed motion and facial expression into the tokens that generate the video.</p>
    </div>
  </section>

  <section id="character-animation" class="try-on-section try-on-data" aria-labelledby="model-title">
    <div>
      <h2 id="model-title">How I built the training pairs</h2>
      <p>For IM-Animation I drew on <strong>3.2 hours of real footage from four fashion datasets</strong> (UBC-Fashion, TikTokDress, Try-Any-Bench and ViViD). I kept steady shots showing one person’s face, upper body and both hands. Following X-UniMotion’s self-training approach, I took the reference frame and motion from the same shot.</p>
      <p>I rendered <strong>about 10 hours of paired Mixamo footage</strong> in Blender. I gave two characters with different proportions the same action, taking the driving motion from one and the reference still and synchronized target video from the other.</p>
      <p>For the final fine-tune I kept <strong>6,782 clips</strong>, each with a usable face crop across all 81 frames. Played once at 30 fps, they run for about 5.1 hours.</p>
    </div>
    <div>
      {% include try-on-video.liquid
        file="mixamo-salsa-dance" title="Mixamo salsa dance" preload="metadata"
        caption="The character in black leads the steps. The right panel shows my model’s prediction."
      %}
      <details id="training-split">
        <summary>Source footage and training split</summary>
        <p>For my earlier experiments I curated 32.9 hours across six real-video datasets. I trained the IM-Animation retargeter on 8,792 clips, including 2,581 real clips and 6,211 Mixamo pairs. I drew the final fine-tuning set from these clips.</p>
      </details>
      <details>
        <summary>Hand and face supervision</summary>
        <p>In early experiments I used Sapiens joint heatmaps and hand surface normals. The dense maps were expensive to store, and the fine hand and face joints were hard to fit. For IM-Animation I built pose targets from 23 body and 42 hand keypoints detected by DWPose and fed cropped faces to a separate expression encoder. I tested heatmap resolutions and peak widths and reconstructed the training maps on the GPU from a compact cache.</p>
      </details>
    </div>
  </section>

  <section class="try-on-section try-on-reading" aria-labelledby="motion-check">
    <h2 id="motion-check">Training and checking motion transfer</h2>
    <div>
      <p>I tested an early model by holding the reference fixed and playing the driving clip forward, then backward. The predicted joint positions barely changed on the three frames I checked. I kept this timing check for later runs.</p>
      <p>For the model shown here, I started with the IM-Animation authors’ released motion encoder. I trained the retargeter for 40,000 steps on two GPUs, a little over four days. I then fine-tuned Wan for 20,000 steps on one GPU over about three days.</p>
    </div>
  </section>

  <details class="try-on-examples">
    <summary id="examples-title">More training examples from TikTokDress and Mixamo</summary>
    <div class="try-on-more-media">
      {% include try-on-video.liquid
        file="tiktokdress" title="TikTokDress"
        caption="I animated a dressed still from the training set. The dancer in green provides the motion."
      %}
      {% include try-on-video.liquid
        file="mixamo-seated-clap" title="Mixamo seated clap"
        caption="Two Mixamo characters performing a seated clap."
      %}
    </div>
  </details>
</article>
<script type="module" src="{{ '/assets/js/try-on-cases.js' | relative_url | bust_file_cache }}"></script>
