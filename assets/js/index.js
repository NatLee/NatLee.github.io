$(document).ready(function () {
    $.getJSON("assets/data/site.json", function (data) {
      let main = $("#main");
  
      data.forEach((section) => {
        let header = $('<div class="header"></div>').html(`<h1 style="text-align: center">${section.header}</h1>`);
        main.append(header);
  
        let inner = $('<div class="inner"></div>');
        let tiles = $('<section class="tiles"></section>');
        inner.append(tiles);
  
        section.articles.forEach((article) => {
          let preview = $(`
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
          tiles.append(preview);
        });
  
        main.append(inner);
      });
    });
  });
