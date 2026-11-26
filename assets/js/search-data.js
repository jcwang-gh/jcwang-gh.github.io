// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Research on 3D reconstruction and Gaussian splatting.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "news-our-paper-low-frequency-first-eliminating-floating-artifacts-in-3d-gaussian-splatting-is-accepted-by-cw2025",
          title: 'Our paper “Low-Frequency First: Eliminating Floating Artifacts in 3D Gaussian Splatting” is accepted...',
          description: "",
          section: "News",},{id: "news-our-paper-has-received-cw2025-best-paper-honorable-mention",
          title: 'Our paper has received CW2025 Best Paper Honorable Mention!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2025-10-16-longnews.html";
            },},{id: "news-i-am-honored-with-the-open-source-contribution-award",
          title: 'I am honored with the Open Source Contribution Award!',
          description: "",
          section: "News",},{id: "news-our-paper-frequency-aware-optimization-for-floating-artifact-removal-in-3d-gaussian-splatting-is-accepted-by-the-visual-computer-tvc",
          title: 'Our paper “Frequency-Aware Optimization for Floating Artifact Removal in 3D Gaussian Splatting” is...',
          description: "",
          section: "News",},{id: "projects-epea-ba",
          title: 'EPEA-BA',
          description: "Error propagation in bundle adjustment and a GPU solver based on independent camera fits and curvature-corrected point updates.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/epea-ba/";
            },},{id: "projects-video-virtual-try-on",
          title: 'Video Virtual Try-On',
          description: "I built and trained the animation stage of a video try-on prototype. My model transfers motion from a driving video to the person in a dressed reference image.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/video-virtual-try-on/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%63%77%61%6E%67.%67%6F%6F%67@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/jcwang-gh", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/jcwang-ld", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0006-8709-4530", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=61VwQ4cAAAAJ", "_blank");
        },
      },{
        id: 'social-wechat_qr',
        title: 'Wechat_qr',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/jcwangx", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
