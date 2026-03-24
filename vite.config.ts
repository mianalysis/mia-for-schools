import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import solid from 'vite-plugin-solid';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/mia-for-schools/',
  plugins: [
    solid(),
    nodePolyfills(),
    {
      name: 'range-request-support',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.endsWith('.jar')) return next();

          const filePath = path.join(__dirname, 'public', req.url);
          if (!fs.existsSync(filePath)) return next();

          const stat = fs.statSync(filePath);
          const fileSize = stat.size;
          const rangeHeader = req.headers['range'];

          if (rangeHeader) {
            const [, range] = rangeHeader.split('=');
            const [startStr, endStr] = range.split('-');
            const start = parseInt(startStr, 10);
            const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize,
              'Content-Type': 'application/java-archive',
            });
            fs.createReadStream(filePath, { start, end }).pipe(res);
          } else {
            res.writeHead(200, {
              'Content-Length': fileSize,
              'Accept-Ranges': 'bytes',
              'Content-Type': 'application/java-archive',
            });
            fs.createReadStream(filePath).pipe(res);
          }
        });
      },
    },
  ],
  build: {
    target: 'esnext',
  },
});
