---
layout: about
title: About
permalink: /
subtitle: Visiting Research Assistant · <a href='https://engineering.westlake.edu.cn/'>School of Engineering, Westlake University</a> · Advised by Prof. Yuliang Xiu
profile:
  align: right
  image: wjc-2.png
  image_alt: Jianchao Wang at his research workstation
  image_circular: false
  more_info: >
    <p>Hangzhou, China</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: false
  limit: 3
---

I’m looking for a **Ph.D. position starting in 2027**. My research focuses on 3D/4D reconstruction and geometry-aware video generation.
I am particularly interested in extending geometric reasoning to world models and physical AI.

I earned my B.Eng. in Software Engineering at Nanjing University of Aeronautics and Astronautics in 2023.
I stayed on for my M.Eng. in Computer Science (2026), supervised by Prof. Jie Qin. During my master’s, I developed EFA-GS to reduce
floating artifacts in 3D Gaussian splatting. Our paper received a Best Paper Honorable Mention at Cyberworlds 2025.
{% assign efa_gs_metrics = site.data.publication_metrics.wang2025lowfrequencyfirsteliminatingfloating -%}
The paper has {{ efa_gs_metrics.google_scholar.count }} citations on Google Scholar,
and the EFA-GS repository has {{ efa_gs_metrics.github.count }} GitHub stars.
Parthsarthi Rawat’s DENSER built on EFA-GS and won the SoccerNet 2026 Novel View Synthesis Challenge.
[Challenge results](https://arxiv.org/html/2607.07320v1#S4.SS4)

- At Westlake, I initiated **EPEA-BA** to study how approximation errors propagate between cameras and 3D points in bundle adjustment.
  I derived error-transfer equations for both elimination orders and analyzed how viewing geometry can amplify small camera rotation errors into
  large compensating displacements of distant 3D points.

  I used this analysis to develop a GPU solver that replaces the global linear solve with independent camera fits and curvature-corrected Adam
  updates for 3D points. Under matched optimization budgets, EPEA-BA reached the target reprojection error on 16 of 20 scenes, compared with
  14 for MegBA and 8 for Caspar. On the largest BAL scene, it reached the target in 4.92 seconds of optimization time.

  Preprint and code in preparation. [Project Page]({% link _projects/epea-ba.md %})

- For **Video Virtual Try-On**, I started by reproducing OmniTryOn and ViViD. In one ViViD clip, the original red collar was still visible above
  the new white blouse as the wearer turned. I designed the pipeline to fit the garment in a still image first, then animate the wearer using motion from the original video.

  I built the animation model on Wan2.2 and trained it in stages following IM-Animation. I curated 3.2 hours of footage from four fashion datasets
  and used Blender to render about 10 hours of paired Mixamo clips. Each pair shows two characters with different proportions performing the same action.
  [Project Page]({% link _projects/video-virtual-try-on.md %})
