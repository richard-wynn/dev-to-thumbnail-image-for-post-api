const moment = require('moment');
const { v4 } = require('uuid');
const puppeteer = require('puppeteer');
const fs = require('fs');

const renderHead = () => {
  return `
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #606060;
          padding: 82px;
          font-size: 38px;
          font-family: 'Roboto', sans-serif;
          width: 1600px;
        }

        .post-image-wrapper {
          background-color: white;
          border: 2px solid black;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          padding: 32px 42px;
          box-shadow: 12px 12px 0 black;
          margin: 0 auto;
          padding-top: 62px;
        }

        .post-image-title {
          font-size: 3em;
        }

        .post-image-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 132px;
        }

        .post-image-footer-left {
          display: flex;
          align-items: center;
        }

        .post-image-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 3px solid black;
          object-fit: cover;
          padding: 1px;
          margin-right: 10px;
        }

        .post-image-dot {
          margin: 0 12px;
        }

        .post-image-badge {
          width: 64px;
          height: 64px;
          object-fit: cover;
        }

        #js-badge {
          transform: rotate(-2deg);
        }

        #dev-to-badge {
          transform: rotate(8deg);
          margin-left: 3px;
        }
      </style>
    </head>
  `;
};

const renderBody = (post) => {
  const { title, avatar, full_name, creation_time } = post;

  return `
    <body>
      <div class="post-image-wrapper">
        <div class="post-image-header">
          <h1 class="post-image-title">${title}</h1>
        </div>

        <div class="post-image-footer">
          <div class="post-image-footer-left">
            <img src="${avatar}" alt="Avatar" class="post-image-avatar" />
            <span class="post-image-author">${full_name}</span>
            <span class="post-image-dot">•</span>
            <span class="">${moment(creation_time).format('MMMM DD')}</span>
          </div>

          <div class="post-image-footer-right">
            <div class="post-image-badges">
              <img src="https://i.imgur.com/Xe9C9kI.png" alt="JavaScript Badge" class="post-image-badge" id="js-badge" />
              <img src="https://i.imgur.com/OW7qG1B.png" alt="Dev.to Badge" class="post-image-badge" id="dev-to-badge" />
            </div>
          </div>
        </div>
      </div>
    </body>
  `;
};

const getImageHtml = (post) => {
  return `
    <html lang="en">
      ${renderHead()}
      ${renderBody(post)}
    </html>
  `;
};

const createImage = async (post) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const fileName = `${v4()}.png`;

    await page.setContent(getImageHtml(post));

    const content = await page.$('body');
    const imageBuffer = await content.screenshot({ omitBackground: true });

    fs.writeFileSync(`./public/${fileName}`, imageBuffer);

    return fileName;
  } catch (error) {
    return '';
  } finally {
    await browser.close();
  }
};

module.exports = {
  createImage,
};
