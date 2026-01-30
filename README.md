# Landing

Минимальный статичный каркас лендинга (HTML+CSS), где все “сложные” блоки будут SVG из `sources/assets/`.

## Запуск

Самый простой способ: открыть `index.html` в браузере (он перекинет на `en/`).

Если нужно, чтобы корректно работал `download` на кнопке, подними простой локальный сервер:

```bash
cd Killah-Landing
python3 -m http.server 8080
```

Открой `http://localhost:8080` (по умолчанию редиректит в `en/`).

## Деплой на GitHub Pages

В репозитории есть workflow: `.github/workflows/pages.yml`, который публикует содержимое репозитория в корень GitHub Pages.

1) Запушь в ветку `main`
2) В GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**
3) Подожди пока отработает Actions job “Deploy Landing to GitHub Pages”

После этого сайт будет доступен по GitHub Pages URL. Рут `/` редиректит на `/en/`.

### Кастомный домен

В GitHub: **Settings → Pages → Custom domain** (например `killah.app`). DNS обычно:

- `A` записи на GitHub Pages IP (или `CNAME` на `<username>.github.io` — зависит от типа Pages)

### DMG

По умолчанию CTA ведёт на `/sources/downloads/killah.dmg`.

Положи файл в `sources/downloads/killah.dmg` (для локальной проверки) и опубликуй.
Если `.dmg` большой — лучше хранить его в GitHub Releases или в объектном хранилище (R2/S3/B2) и просто поменять ссылку в HTML.

GitHub Releases (рекомендуется для больших файлов):

- URL вида: `https://github.com/<owner>/<repo>/releases/latest/download/killah.dmg`
- Поменяй `href` у CTA в `en/index.html` и `ru/index.html`

Workflow для релизов: `.github/workflows/release-dmg.yml`

- Создай тег вида `v0.1.0` и запушь его
- Workflow создаст Release и загрузит `sources/downloads/killah.dmg`
