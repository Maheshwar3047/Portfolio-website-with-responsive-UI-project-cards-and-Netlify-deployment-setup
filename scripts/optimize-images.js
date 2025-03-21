const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');
const SIZES = [
  { width: 640, suffix: '-sm' },
  { width: 1024, suffix: '-md' },
  { width: 1920, suffix: '-lg' }
];

async function optimizeImages() {
  try {
    const files = fs.readdirSync(BUILD_DIR);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg)$/.test(file) && 
      !file.includes('-sm') && 
      !file.includes('-md') && 
      !file.includes('-lg')
    );

    for (const file of imageFiles) {
      const filePath = path.join(BUILD_DIR, file);
      const { name, ext } = path.parse(file);

      // Original file optimization
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(path.join(BUILD_DIR, `${name}.webp`));

      // Generate different sizes
      for (const { width, suffix } of SIZES) {
        const optimizedName = `${name}${suffix}${ext}`;
        const optimizedWebpName = `${name}${suffix}.webp`;

        await sharp(filePath)
          .resize(width, null, { withoutEnlargement: true })
          .toFile(path.join(BUILD_DIR, optimizedName));

        await sharp(filePath)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(BUILD_DIR, optimizedWebpName));
      }

      // Clean up duplicate files
      const duplicates = files.filter(f => 
        f.startsWith(name) && 
        !SIZES.some(({ suffix }) => f.includes(suffix)) &&
        f !== file &&
        f !== `${name}.webp`
      );

      duplicates.forEach(dup => {
        fs.unlinkSync(path.join(BUILD_DIR, dup));
      });
    }

    console.log('✓ Images optimized successfully');
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();