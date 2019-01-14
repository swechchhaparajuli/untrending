'use strict';
$(document).ready(() => {
  $('.unfold-nav').hide();
  $('.categories-list').hide();
  // This file just does a GET request to figure out which user is logged in
  $.get('/api/user').then(data => {
    const $header = $('#btn-insert');
    if (data) {
      const $logout = $('<a>');
      $logout.attr('class', 'navbar-brand');
      $logout.attr('id', 'logout-button');
      $logout.html('Logout');
      $logout.attr('href', '/logout');
      $header.append($logout);
      const $userInfo = $('<a>');
      $userInfo.attr('class', 'navbar-brand');
      $userInfo.attr('id', 'user-info');
      $userInfo.html(data.user.username);
      $userInfo.attr('href', '/profile');
      $header.append($userInfo);
      categoriesCall(data.categories);
    } else {
      const $signin = $('<a>');
      $signin.attr('class', 'navbar-brand');
      $signin.attr('id', 'signin-button');
      $signin.html('Sign In With Google');
      $signin.attr('href', '/auth/google');
      $header.append($signin);
      trendingCall();
    }
  });
});

const trendingCall = () => {
  $.get('/newsapi/trending').then(data => {
    displayArticles(data);
  });
};

const categoriesCall = cat => {
  $.get(
    `/newsapi/categories/${cat.business}/${cat.entertainment}/${cat.health}/${
      cat.science
    }/${cat.sports}/${cat.technology}`
  ).then(data => {
    console.log(data)
    displayArticles(data);
  });
};

$('#search-btn').on('click', event => {
  event.preventDefault();
  const query = $('#search-input')
    .val()
    .trim()
    .toLowerCase();
  document.getElementById('search-form').reset();
  $.get(`/newsapi/search/${query}`).then(data => {
    displayArticles(data);
  });
});

const displayArticles = articles => {
  $('.thumbnail-feed').empty();
  const article = articles.response.articles;
  const articleHolder = [];
  for (let i = 0; i < article.length; i++) {
    if (article[i].title && article[i].description && article[i].content) {
      let title = article[i].title;
      let subtitle = article[i].description;
      let date = article[i].publishedAt;
      let blurb = article[i].content.split('[+')[0];
      let artUrl = article[i].url;
      let thumbnail = article[i].urlToImage;

      let $title = $(
        `<a href=${artUrl}><div class='title'>${title}</div ></a>`
      );
      let $date = $(
        `<div class='date'><mark>PUBLISHED AT: ${date}<mark></div >`
      );
      let $subtitle = $(`<div class='subtitle'>'${subtitle}'</div >`);
      let $blurb = $(`<div class='blurb'>${blurb}</div >`);
      let $artUrl = $(`<a href=${artUrl}>READ ARTICLE</a>`);

      let $thumbnail = $(
        `<img class='thumbnail' src=${thumbnail} data-article=${i}> <br>`
      );

      articleHolder.push({
        title: $title,
        date: $date,
        subtitle: $subtitle,
        blurb: $blurb,
        arturl: $artUrl
      });
      $('.thumbnail-feed').prepend($thumbnail);
    } else {
      articleHolder.push({ article: null });
      continue;
    }
  }

  $('.thumbnail').mouseover(function(event) {
    $('.front-page-feed').empty();
    const id = $(this).data('article');
    const article = articleHolder[id];
    $('.front-page-feed').append(
      article.title,
      article.date,
      article.subtitle,
      article.blurb,
      article.arturl
    );
  });
};

///                 NAV BAR                 ///
$('#fold-nav-line').on('click', function() {
  $('#fold-nav-line').hide();
  // $('.unfold-nav').show();

  $('#unfold-nav-logo').mouseover(function() {
    // $('.categories-list').show();

    $('.nav-category').on('click', function() {
      // needs to refilter newsfeed by topic
    });
  });

  $('#x').on('click', function() {
    // $('#fold-nav-line').show();
    $('.unfold-nav').hide();
    $('.categories-list').hide();
  });
});

// $(".unfold-nav").mouseout(function() {
//     $("#fold-nav-line").show();
//     $(".unfold-nav").hide();
//     $(".categories-list").hide();

// })

///                 TOP HEADLINES                    ///

var frontPage;
var articleHolder = [];

// var headlines = [];

var queryURL =
  'https://newsapi.org/v2/top-headlines?' +
  'country=us&' +
  'apiKey=abf7b2766a1549eca7580d1b261d5838';

function search() {
  ///                 SEARCH QUERY                   ///
  var search;

  var countryAcr = 'https://restcountries.eu/rest/v2/name/{' + 'UK' + '}';
  var countryRef = '';
  $.ajax({
    url: queryURL,
    method: 'GET',
    error: function() {
      console.log('error');
    },
    success: function(data) {
      countryRef = data[0].alpha2Code;
    }
  });

  function processData(data) {
    console.log(data);

    for (var i = 0; i < data.articles.length; i++) {
      var title = data.articles[i].title;
      // console.log(title);

      var subtitle = data.articles[i].description;
      // console.log(subtitle);

      var date = data.articles[i].publishedAt;
      // console.log(date);

      var blurb = data.articles[i].content;
      // console.log(blurb);

      var artUrl = data.articles[i].url;
      console.log(artUrl);

      // var fullArt = data.articles[i].content;
      // console.log(fullArt)

      var $title = $(
        '<a href=' + artUrl + '><div class="title">' + title + '</div ></a>'
      );
      var $date = $(
        '<div class="date"><mark>PUBLISHED AT: ' + date + '<mark></div >'
      );
      var $subtitle = $('<div class="subtitle">' + subtitle + '</div >');
      var $blurb = $('<div class="blurb">' + blurb + '</div >');
      var $artUrl = $(
        '<a  href=' +
          artUrl +
          "><img class='arrow' src='./assets/readartarrow.png'></a>"
      );

      // headlines.push(title);
      // console.log(headlines[20]);
      // module.exports = {headlines: headlines};

      articleHolder.push({
        title: $title,
        date: $date,
        subtitle: $subtitle,
        blurb: $blurb,
        arturl: $artUrl,
        id: i
      });
    }

    for (var i = 0; i < data.articles.length; i++) {
      var thumbnail = data.articles[i].urlToImage;
      // console.log(thumbnail);

      var $thumbnail = $(
        `<img class ='thumbnail' src=${thumbnail} data-article=${i}> <br>`
      );

      $('.thumbnail-feed').append($thumbnail);
    }

    // $('.thumbnail').each(function(){
    //     $(this).parallax("50%", 0.6);
    //  });

    // $('.thumbnail').parallax({imageSrc: thumbnail});

    $('.thumbnail').mouseover(function() {
      $('.front-page-feed').empty();
      var id = $(this).attr('data-article');
      console.log(id);

      articleHolder.forEach(function(article) {
        // console.log(article.id)

        if (id == article.id) {
          var editedBlurb = article.blurb[0].innerText.split('[')[0];

          console.log(editedBlurb);
          var $editedBlurb = $(
            '<div class="edited-blurb">' + editedBlurb + '</div>'
          );
          $('.front-page-feed').append(
            article.title,
            article.date,
            article.subtitle,
            $editedBlurb,
            article.arturl
          );
        }
      });
    });
  }

  // var x;
  // var index = 0;

  // function setup() {
  //     createCanvas(1000, 100);
  //     x = width;
  // }

  // function draw() {
  //     background(255);
  //     fill(0);

  //     // Display headline at x  location
  //     // textFont(f,16);
  //     textAlign(LEFT);
  //     text(headlines[index],x,180);

  //     // Decrement x
  //     x = x - 3;

  //     // If x is less than the negative width,
  //     // then it is off the screen
  //     var w = textWidth(headlines[index]);
  //     if (x < -w) {
  //       x = width;
  //       index = (index + 1) % headlines.length;
  //     }
  //   }

  //   setup();
  //   draw();

  ///                 SEARCH QUERY                   ///
  var search;

  var countryAcr = 'https://restcountries.eu/rest/v2/name/{' + 'UK' + '}';
  var countryRef = '';
  $.ajax({
    url: queryURL,
    method: 'GET',
    error: function() {
      console.log('error');
    },
    success: function(data) {
      countryRef = data[0].alpha2Code;
    }
  });

  var url =
    'https://newsapi.org/v2/everything?' +
    'q=' +
    search +
    '&' +
    'from=2019-01-10&' +
    'sortBy=popularity&' +
    'apiKey=abf7b2766a1549eca7580d1b261d5838';
}

//pseuocode: on click of submit button, user input = search, and call processData.

// search = $("#search-input").val();
// console.log(search);

// on click of submit button, user input = search, and call processData.

///                 RIP OUT SOURCES FOR FILTERING ALGORITHM                   ///

///              FILTERING ALGORITHM                   ///

function showAlternativeSideNews(manipulateData) {
  /*
    ** 
    input: data from current article being viewed
        OR
    input: data points from search query
        if (from search query)
            commonPoints = find CommonViewPointShownRatio(manipulateData)
        else 
            commonPoints = give article a certain point
    */
  return manipulateData;
}

// pulls the average common point value of the different sources that come up as results in the search query
function commonView(manipulateData) {
  /*
        // put points in an array
        // check for outliers, 
            if there are outliers (checking for 1-3 vs 7-10 conservative level) 
                find more frequent of the two sides, and pick the one that is more frequent
                frequency depends on 5 results more to one side
                    if one is more frequent then choose that and return (that common point)
            else 
                return (average);
                
    */
}

function mixSearchResults(manipulateData) {
  //manipulate if there is time

  return manipulateData;
}

function chooseAlternateCountryViews(manipulateData) {
  /*
        if (key words in headline, name of another country, middle east, central america, reference
            to foreign affairs. make a db table or an array of key words for reference)
                find other data from foreign tagged news sources
        else    
    */

  return manipulateData;
}

function keyWord() {
  var querySites = [];
}

function loosenCategoryParameters(data) {
  /*
        data--> whatever interests the user has. Takes it in and 
        manipulates (search, and top 20 methods so that you check
        key words in the title for sports terms as well as 
        choosing through category)
    */

  return data;
}

///                 RIP OUT SOURCES FOR FILTERING ALGORITHM                   ///
