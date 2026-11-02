// Bonfire 主題（2018 年的外觀）：像素篝火下的一格格連結。
// 原本讀 assets/data/site.json；現在從 /content/site.json 組出同樣的四個區塊，這個主題不再存放任何個人資料。
$(document).ready(function () {
  var TILE_IMAGE = {
    github: 'assets/img/github.png',
    blog: 'assets/img/hexo.png',
    medium: 'assets/img/medium.png',
    linkedin: 'assets/img/linkedin.png',
    kaggle: 'assets/img/kaggle.png',
    leetcode: 'assets/img/leetcode.png',
    huggingface: 'assets/img/hugging-face.png',
  };
  var TILE_NOTE = {
    github: 'Code and open-source work.',
    blog: 'Long-form notes.',
    medium: 'Articles.',
    linkedin: 'Work history, the formal version.',
    kaggle: 'Competitions and notebooks.',
    leetcode: 'Practice problems.',
    huggingface: 'Models and spaces.',
  };
  var PERSONAL = ['blog', 'medium', 'linkedin'];
  var TECH = ['github', 'kaggle', 'leetcode', 'huggingface'];

  function escape(value) {
    return $('<div>').text(value == null ? '' : String(value)).html();
  }

  function en(value) {
    return value && typeof value === 'object' ? value.en : value || '';
  }

  function createHeader(headerText) {
    return $('<div class="header"></div>').html('<h1 style="text-align: center">' + escape(headerText) + '</h1>');
  }

  function createArticle(article) {
    return $(
      '<article class="preview">' +
        '<span class="image"><img src="' + escape(article.imgSrc) + '" alt="" /></span>' +
        '<a target="_blank" rel="noopener noreferrer" href="' + escape(article.link) + '">' +
        '<h2>' + escape(article.title) + '</h2>' +
        '<div class="content"><p>' + escape(article.description) + '</p></div>' +
        '</a>' +
      '</article>'
    );
  }

  function socialTiles(socials, icons) {
    return socials
      .filter(function (s) { return icons.indexOf(s.icon) >= 0; })
      .map(function (s) {
        return { imgSrc: TILE_IMAGE[s.icon], link: s.url, title: s.name, description: TILE_NOTE[s.icon] || '' };
      });
  }

  function projectTile(project) {
    return {
      imgSrc: project.thumbnail || (project.theme === 'libraries' ? 'assets/img/pypi.png' : 'assets/img/github.png'),
      link: project.links.github || project.links.demo || project.url,
      title: en(project.title),
      description: en(project.description),
    };
  }

  function render(site) {
    var main = $('#main');
    var profile = site.profile;
    document.title = profile.name + ' | Link';

    var sections = [
      { header: profile.name + ' | Link', articles: socialTiles(profile.socials, PERSONAL) },
      { header: 'Tech Site', articles: socialTiles(profile.socials, TECH) },
      {
        header: 'Side Projects',
        articles: site.projects.filter(function (p) { return p.tier !== 'archive' && p.theme !== 'libraries'; }).map(projectTile),
      },
      {
        header: 'Tools',
        articles: site.projects.filter(function (p) { return p.theme === 'libraries'; }).map(projectTile),
      },
    ];

    sections.forEach(function (section) {
      if (!section.articles.length) return;
      main.append(createHeader(section.header));
      var inner = $('<div class="inner"></div>');
      var tiles = $('<section class="tiles"></section>');
      inner.append(tiles);
      section.articles.forEach(function (article) {
        tiles.append(createArticle(article));
      });
      main.append(inner);
      main.append('<br>');
    });
  }

  $.getJSON('/content/site.json')
    .done(render)
    .fail(function () {
      $('#main').append(createHeader('The bonfire went out. Try again later.'));
    });
});
