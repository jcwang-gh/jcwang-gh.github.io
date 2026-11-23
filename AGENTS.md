# Repository Guidelines

## Project Structure & Module Organization

This academic site uses Jekyll and al-folio. The homepage is `_pages/about.md`. Other content lives in `_pages/`, `_news/`, `_projects/`, `_books/`, and `_bibliography/`. Shared templates are in `_layouts/` and `_includes/`, plugins in `_plugins/`, and utility scripts in `_scripts/` and `bin/`.

`assets/json/resume.json` supplies the CV page, and `assets/pdf/English_CV.pdf` is its downloadable version. `_data/cv.yml` supplies the fallback CV layout. Social links and repository lists live in `_data/`. Frontend assets live under `assets/`, with Sass sources in `_sass/`.

## Media and Git LFS

- Run `git lfs install --local` and `git lfs pull` after cloning. Workflows that build the site from source need `lfs: true` on the checkout step.
- Put display-ready images and videos under `assets/img/` and `assets/video/`. Keep source archives and unedited recordings outside the published site.
- `.gitattributes` defines the LFS file types. Stage matching files with `git add` as usual. When adding an LFS rule for existing files, use `git add --renormalize -- <paths>` to update their staged representation. Check the result with `git lfs ls-files`.
- Preview cache cleanup with `git lfs prune --dry-run --verify-remote --verify-unreachable --when-unverified=continue`. To delete the verified copies, rerun without `--dry-run`. Run `git gc` to pack ordinary Git objects.

## Build, Test, and Development Commands

- `docker compose up` starts the local preview at `http://localhost:8080`.
- `bundle exec jekyll build` writes the site to `_site/`. Set `JEKYLL_ENV=production` to exercise the minification used for deployment.
- `npm ci` installs the locked formatting dependencies. Run `npx prettier . --check` to check formatting and `npx prettier <paths> --write` to format changed files.
- `pre-commit run --all-files` runs the hooks in `.pre-commit-config.yaml`.
- `purgecss -c purgecss.config.js` removes unused CSS from a finished build, as in the deployment workflow.

## Coding Style & Naming Conventions

Follow `.prettierrc` for Liquid, HTML, and Markdown. It uses `@shopify/prettier-plugin-liquid`, a print width of 150, and ES5 trailing commas. Follow the existing Jekyll naming patterns, including `YYYY-MM-DD-title.md` for news. Keep `_data/*.yml` entries stable and alphabetize social metadata where `CONTRIBUTING.md` specifies it.

## Testing Guidelines

1. Build the site and run the Prettier check. For changes to media, run `git lfs fsck` and check that the built images and videos open.
2. Preview changed pages at desktop and mobile widths. For CV changes, follow the project link in both the web CV and the downloadable PDF. Use the public `https://jcwang-gh.github.io/` address for links shared in the CV.
3. Check the relevant GitHub Actions results. The repository has formatting, link, and accessibility workflows. Fix failures affecting the change.

## Commit & Pull Request Guidelines

Use a short imperative subject, such as `update about.md`. Keep each commit focused. In a pull request, summarize the change and its purpose, link the relevant issue if one exists, include screenshots for visible changes, and report the build and formatting results. Keep unrelated content, dependency, and workflow edits in separate pull requests.
