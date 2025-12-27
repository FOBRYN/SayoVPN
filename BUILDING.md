# Как собрать SayoVPN.exe

## ВАЖНО: Перед сборкой

В файле `vite.config.ts` добавьте строку `base: "./"` в секцию конфигурации:

```typescript
export default defineConfig({
  // ... другие настройки
  base: "./",  // <-- добавьте эту строку
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  // ...
});
```

Это необходимо для корректной работы путей в Electron.

---

## Вариант 1: Через GitHub Actions (Автоматически)

После пуша в репозиторий, GitHub автоматически соберет .exe файл:

1. Перейдите в ваш репозиторий на GitHub
2. Откройте вкладку **Actions**
3. Найдите последний запуск **Build Windows EXE**
4. После завершения сборки, скачайте **SayoVPN-Windows** из раздела Artifacts

## Вариант 2: Локальная сборка (На Windows)

### Требования:
- Node.js 18+ (скачать: https://nodejs.org/)
- Git

### Шаги:

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Установите зависимости
npm install

# 3. Соберите веб-приложение
npm run build:client

# 4. Соберите .exe
npx electron-builder --win
```

После сборки файл `SayoVPN Setup.exe` появится в папке `release/`.

## Структура Electron

- `electron/main.js` - Главный процесс Electron
- `electron/preload.js` - Preload скрипт для безопасности
- `build/icon.png` - Иконка приложения (замените на .ico для Windows)

## Иконка приложения

Для Windows иконки, конвертируйте `build/icon.png` в `build/icon.ico` используя:
- https://convertio.co/png-ico/
- Или любой другой конвертер PNG → ICO

## Команды

| Команда | Описание |
|---------|----------|
| `npm run electron:dev` | Запуск в режиме разработки |
| `npm run electron:build` | Сборка .exe для Windows |
| `npm run electron:build:all` | Сборка для всех платформ |
