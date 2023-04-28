$(document).ready(function () {
    $.getJSON("assets/data/site.json", function (data) {
      let main = $("#main");
  
      function createHeader(headerText) {
        return $('<div class="header"></div>').html(`<h1 style="text-align: center">${headerText}</h1>`);
      }
  
      function createArticle(article) {
        return $(`
          <article class="preview">
            <span class="image">
              <img src="${article.imgSrc}" alt="" />
            </span>
            <a target="_blank" rel="noopener noreferrer" href="${article.link}">
              <h2>${article.title}</h2>
              <div class="content">
                <p>${article.description}</p>
              </div>
            </a>
          </article>
        `);
      }
  
      data.forEach((section) => {
        main.append(createHeader(section.header));
  
        let inner = $('<div class="inner"></div>');
        let tiles = $('<section class="tiles"></section>');
        inner.append(tiles);
  
        section.articles.forEach((article) => {
          tiles.append(createArticle(article));
        });
  
        main.append(inner);
        main.append('<br>'); // Add a line break between sections
      });
    });
  });