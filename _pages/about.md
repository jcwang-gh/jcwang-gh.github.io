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

I’m looking for a **Ph.D. position starting in 2027**. My research interests include 4D reconstruction, geometry foundation models,
video generation, world models, and physical AI.

I earned my B.Eng. in Software Engineering at Nanjing University of Aeronautics and Astronautics in 2023.
I stayed on for my M.Eng. in Computer Science (2026), supervised by Prof. Jie Qin. During my master’s, I developed EFA-GS to reduce
floating artifacts in 3D Gaussian splatting. Our paper received a Best Paper Honorable Mention at Cyberworlds 2025.

- At Westlake, I developed **EPEA-BA**, a GPU solver for approximate bundle adjustment.
  I traced how errors pass between camera estimates and 3D points. The elimination order sets the direction of that transfer, and the viewing geometry
  determines which errors grow.

  The solver updates the camera parameters first, then refines each 3D point across views using curvature-corrected Adam.
  I tested it on 20 scenes from BAL and 1DSfM. On the largest BAL scene, it reached the target reprojection error in 4.92 seconds, compared with
  6.35 seconds for Caspar. Our paper is under review, and we plan to post the preprint on arXiv and open-source the code soon.

- For **Video Virtual Try-On**, I started by reproducing OmniTryOn and ViViD. In one ViViD clip, the original red collar was still visible above
  the new white blouse as the wearer turned. I designed the pipeline to fit the garment in a still image first, then animate the wearer using motion from the original video.

  I built the animation model on Wan2.2 and trained it in stages following IM-Animation. I curated 3.2 hours of footage from four fashion datasets
  and used Blender to render about 10 hours of paired Mixamo clips. Each pair shows two characters with different proportions performing the same action.
  [Project Page]({% link _projects/video-virtual-try-on.md %})
