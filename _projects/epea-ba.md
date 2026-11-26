---
layout: default
title: EPEA-BA
permalink: /projects/epea-ba/
description: Error propagation in bundle adjustment and a GPU solver based on independent camera fits and curvature-corrected point updates.
importance: 0
featured: true
img: /assets/img/epea-ba/teaser-f13682.webp
img_alt: The F13682 panel of the paper teaser compares three solvers by time to target, final RMSE, and measured GPU memory.
# Target coverage is from the 20-scene appendix table. F13682 timing and final RMSE are from Table 1.
coverage:
  - { name: EPEA-BA, series: epea, scenes: 16, time: "4.92", rmse: "1.21" }
  - { name: MegBA, series: megba, scenes: 14, time: "7.63", rmse: "1.23" }
  - { name: Caspar, series: caspar, scenes: 8, time: "6.35", rmse: "1.22" }
# Peak memory is from the separate profiling runs in Appendix D.3.
memory:
  - { name: EPEA-BA, mode: cached, series: epea, peak: "6.60" }
  - { name: EPEA-BA, mode: recomputed, series: epea, peak: "4.44" }
  - { name: Caspar, series: caspar, peak: "9.06" }
  - { name: MegBA, mode: setup only, series: megba, peak: "13.14", setup_only: true }
---

<link rel="stylesheet" href="{{ '/assets/css/epea-ba.css' | relative_url | bust_file_cache }}">

<article class="epea-ba">
  <header class="epea-hero">
    <a class="epea-back" href="{{ '/projects/' | relative_url }}">Projects</a>
    <h1>{{ page.title }}</h1>
    <p class="epea-subtitle">From Error Propagation to Efficient and Accurate Bundle Adjustment</p>
    <p class="epea-release-note">The arXiv preprint and open-source code will be available soon.</p>
    <figure class="epea-paper-figure epea-teaser">
      <a href="{{ '/assets/img/epea-ba/paper-teaser.webp' | relative_url }}">
        <picture>
          <source media="(max-width: 700px)" srcset="{{ '/assets/img/epea-ba/paper-teaser-stacked.webp' | relative_url }}" width="1280" height="1229">
          <img
            src="{{ '/assets/img/epea-ba/paper-teaser.webp' | relative_url }}"
            width="2560"
            height="655"
            alt="Full-resolution paper teaser. Radar plots and tables compare time to target, final pixel RMSE, and sampled peak GPU memory on F13682 and V1778."
          >
        </picture>
      </a>
      <figcaption>On F13682 and V1778, EPEA-BA reaches the target faster than Caspar and MegBA. Larger radar radii indicate better performance. The memory values come from separate profiles using an earlier EPEA-BA camera-update configuration. MegBA’s profiles cover preparation only. All three V1778 Caspar profiling runs returned a nonpositive focal length (Appendix D.3).</figcaption>
    </figure>
  </header>

  <section class="epea-section" aria-labelledby="motivation">
    <h2 id="motivation">Motivation</h2>
    <p>Bundle adjustment (BA) refines cameras and 3D points together by minimizing reprojection error. Their coupling makes the global linear solve expensive on large reconstructions. Both elimination orders give the same exact step on a common identifiable linearization. With a cheaper approximate solve, the order determines which variables inherit the remaining update error.</p>
  </section>

  <section class="epea-section" aria-labelledby="theory">
    <h2 id="theory">Theoretical Findings</h2>
    <div class="epea-analysis">
      <dl class="epea-transfer">
        <div>
          <dt>Forward elimination</dt>
          <dd>Eliminate points first. An error in the reduced camera solve passes into the 3D points when they are refitted across views.</dd>
          <dd class="epea-equation"><var>e</var><sub>x</sub> = −<var>V</var><sup>−1</sup><var>W</var><sup>⊤</sup><var>e</var><sub>c</sub> + <var>V</var><sup>−1</sup><var>s</var><sub>x</sub></dd>
        </div>
        <div>
          <dt>Reverse elimination</dt>
          <dd>Eliminate cameras first. An error in the reduced point solve passes into each camera through the points it observes.</dd>
          <dd class="epea-equation"><var>e</var><sub>c</sub> = −<var>U</var><sup>−1</sup><var>W</var><var>e</var><sub>x</sub> + <var>U</var><sup>−1</sup><var>s</var><sub>c</sub></dd>
        </div>
      </dl>
      <p class="epea-notation">On a fixed linearization with positive definite camera and point blocks, <var>U</var> and <var>V</var> are those blocks, <var>W</var> couples them, <var>e</var> denotes an update error, and <var>s</var> denotes a conditional-fit defect.</p>

      <h3>Geometry and nonlinear risk</h3>
      <p>In each receiving mode, the source image response is divided by the Jacobian’s singular value. An incomplete fit adds a term scaled by its inverse square. Amplification depends on which weak directions the error excites. In one view, the point shift that cancels a small rotation scales with camera-to-point distance and the rotation component perpendicular to the viewing ray. Nearly parallel rays constrain depth weakly. If an update drives the depth toward zero, perspective division can amplify the nonlinear error enough to reverse a predicted decrease.</p>

      <h3>Reduced feedback and local recovery</h3>
      <p>Camera elimination removes the residual component explained by retained camera motions and preserves feedback from every view of a point. On a fixed model, a local self-curvature update of size <var>η</var> multiplies each error mode by <var>1 − ηλ</var>, where <var>λ</var> is the mode’s reduced curvature relative to point self-curvature. When cameras can nearly compensate the point motion, <var>λ</var> is small and recovery is slow.</p>
      <p>We also quantify the objective cost of deferring camera back-substitution. On a fixed affine model, point updates driven solely by reduced feedback follow the same trajectory across camera-compensation schedules given identical initial point states, optimizer histories, and point schedules, with point steps committed as proposed.</p>
    </div>

  </section>

  <section class="epea-section" aria-labelledby="method">
    <h2 id="method">Method</h2>
    <p>EPEA-BA uses reverse elimination to keep feedback from all views of a point while replacing the global solve with local updates. Curvature-corrected Adam (CC-Adam) applies a closed-form correction to Adam’s proposal using each point’s initial 3 × 3 curvature in a fixed spectral basis.</p>
    <figure class="epea-paper-figure epea-full">
      <a href="{{ '/assets/img/epea-ba/paper-framework.webp' | relative_url }}">
        <img
          src="{{ '/assets/img/epea-ba/paper-framework.webp' | relative_url }}"
          width="1920"
          height="1078"
          alt="Full-resolution framework from the paper. EPEA-BA fits camera blocks independently, gathers reduced feedback from complete point tracks, applies CC-Adam in a fixed spectral basis, compensates cameras during the initial window, and checks pixel motion and flagged tracks before relinearizing."
          loading="lazy"
        >
      </a>
      <figcaption>Camera compensation runs for the first 35 update coverages. Independent camera fitting and reduced point feedback continue in every iteration. Pixel limits and whole-track correction control the executed step.</figcaption>
    </figure>
  </section>

  <section class="epea-section" aria-labelledby="results">
    <h2 id="results">Results</h2>
    <p>The benchmark uses the largest instance from each of five BAL families and fifteen 1DSfM reconstructions. Each solver runs once per scene in FP64 under a matched 10- or 30-second optimization budget. <var>T</var><sub>99.5</sub> measures time from the prepared initial state to the first accepted state that closes at least 99.5% of the initial pixel RMSE gap to a per-scene empirical reference fixed before timing.</p>
    <dl class="epea-coverage epea-full" aria-label="Scenes reaching the target within budget">
      {% for result in page.coverage %}
        <div class="epea-series-{{ result.series }}">
          <dt>{{ result.name }}</dt>
          <dd>
            <span class="epea-count">{{ result.scenes }}</span> of 20 scenes
            <span class="epea-bar" style="--epea-fill: {{ result.scenes | times: 5 }}%" aria-hidden="true"></span>
          </dd>
        </div>
      {% endfor %}
    </dl>

    <section class="epea-full" aria-labelledby="f13682">
      <h3 class="epea-result-title" id="f13682">F13682, the largest BAL scene</h3>
      <p class="epea-scene">13,682 cameras · 28.99 million observations. <a href="https://grail.cs.washington.edu/projects/bal/final.html">BAL problem data</a></p>
      <div class="epea-result-grid">
        <figure class="epea-chart" aria-labelledby="convergence-title">
          <figcaption>
            <h4 id="convergence-title">Accepted-state reprojection RMSE</h4>
            <p>Time to target and final RMSE within 30 s. EPEA-BA uses projection caching.</p>
          </figcaption>
          <ul class="epea-legend" role="list">
            {% for result in page.coverage %}
              <li class="epea-series-{{ result.series }}">
                <span class="epea-key" aria-hidden="true"></span>{{ result.name }} <strong>{{ result.time }} s · {{ result.rmse }} px</strong>
              </li>
            {% endfor %}
            <li><span class="epea-key epea-target" aria-hidden="true"></span>99.5% target</li>
          </ul>
          <div class="epea-plot">
            <img
              src="{{ '/assets/img/epea-ba/f13682-convergence.webp' | relative_url }}"
              width="1024"
              height="736"
              alt="The F13682 panel from the paper. The upper logarithmic plot shows the full reprojection RMSE range, and the lower plot shows refinement near the 99.5% target. EPEA-BA reaches the target first, followed by Caspar and MegBA."
              loading="lazy"
            >
            <span>Optimization time (s)</span>
          </div>
        </figure>

        <figure class="epea-chart" aria-labelledby="memory-title">
          <figcaption>
            <h4 id="memory-title">Peak GPU memory (GiB)</h4>
            <p>Median of three sampled process peaks</p>
          </figcaption>
          <dl class="epea-memory">
            {% for profile in page.memory %}
              <div class="epea-series-{{ profile.series }}{% if profile.setup_only %} epea-setup-only{% endif %}">
                <dt>{{ profile.name }}{% if profile.mode %} <span>({{ profile.mode }})</span>{% endif %}</dt>
                <dd>
                  {{ profile.peak }}
                  <span class="epea-bar" style="--epea-fill: calc({{ profile.peak }} * 100% / 14)" aria-hidden="true"></span>
                </dd>
              </div>
            {% endfor %}
          </dl>
          <p class="epea-note">Separate profiles used an earlier EPEA-BA camera-update configuration. The 30 s profiling budget includes preparation. MegBA’s peak covers preparation only.</p>
        </figure>
      </div>
    </section>

  </section>

  <section class="epea-section" aria-labelledby="limitations">
    <h2 id="limitations">Limitations</h2>
    <p>EPEA-BA refines initialized cameras and 3D tracks. The theoretical guarantees concern fixed linearizations in identifiable or retained directions. Changing geometry and poorly constrained views can still yield unstable steps. EPEA-BA missed the target on NYC Library within the tested budget, where MegBA reached it.</p>
  </section>

  <section class="epea-section" aria-labelledby="contributions">
    <h2 id="contributions">My Contributions</h2>
    <div>
      <p>I started EPEA-BA at Westlake University.</p>
      <dl class="epea-contributions">
        <div>
          <dt>Theory</dt>
          <dd>I derived the error-transfer equations for both elimination orders, analyzed how viewing geometry can amplify camera rotation errors at distant points, and quantified local recovery on fixed linearizations.</dd>
        </div>
        <div>
          <dt>Algorithm design</dt>
          <dd>I designed the camera-first reduction and the closed-form curvature correction for Adam’s point updates.</dd>
        </div>
        <div>
          <dt>Engineering</dt>
          <dd>I implemented the GPU solver, including independent camera block solves and per-track aggregation of multi-view residuals.</dd>
        </div>
        <div>
          <dt>Experiments</dt>
          <dd>I evaluated the solver on 20 BAL and 1DSfM scenes and compared time to target and coverage with the GPU baselines under matched budgets.</dd>
        </div>
      </dl>
    </div>
  </section>
</article>
