document.addEventListener("DOMContentLoaded", function () {

  // function getCookie(name) - returns the cookie with the specified name, or 'undefined' if nothing is found
  function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  // Consent banner
  let cookie_banner = getCookie('cookie_banner');
  if (cookie_banner!='true') {
    const cookie_container = document.querySelector(".cookie_banner");
    cookie_container.classList.remove("d-none");
    cookie_container.classList.add("d-flex");

    const apply = cookie_container.querySelector(".cookie_banner_apply");
    apply.addEventListener("click", () => {
      cookie_container.classList.add("d-none");
      document.cookie = "cookie_banner=true; max-age=2592000; path=/";
      cookie_banner = getCookie('cookie_banner');     
    });    
  }    
  else {
    const cookie_container = document.querySelector(".cookie_banner");
    cookie_container.classList.add("d-none");
  }
  // End of Consent banner
  
  // Test banner 
  let test_banner = getCookie('test_banner');
  if (test_banner!='true') {
    const test_info_container = document.querySelector(".test_banner");
    test_info_container.classList.remove("d-none");
    test_info_container.classList.add("d-flex", "flex-row-reverse");

    const closebtn = test_info_container.querySelector(".closebtn");
    closebtn.addEventListener("click", () => {
      test_info_container.classList.add("d-none");
      document.cookie = "test_banner=true; max-age=1800; path=/";    
      test_banner = getCookie('test_banner');     
    });    
  }    
  else {
    const test_info_container = document.querySelector(".test_banner");
    test_info_container.classList.add("d-none");
  }  
  // End of Test banner

  // collapse menu bar on small screen when clicking on menu item
  document.getElementById("navHomeButton").addEventListener("focus", MyFun);
  document.getElementById("navMenuButton").addEventListener("focus", MyFun);
  document.getElementById("navAboutButton").addEventListener("focus", MyFun);
  document.getElementById("navSpecialsButton").addEventListener("focus", MyFun);
  document.getElementById("navbarToggle").addEventListener("blur", MyFun);
  function MyFun(event){
    if (event.target.id == "navHomeButton") {    
    } else if (event.target.id == "navMenuButton") {      
      Global_Obj.loadMenuCategories();
    } else if (event.target.id == "navAboutButton") {     
      Global_Obj.loadAbout();
    } else if (event.target.id == "navSpecialsButton") {     
      Global_Obj.loadSpecials();
    } else if (event.target.id == "navbarToggle") {      

        var myCollapse = document.getElementById("navbarSupportedContent");
        var bsCollapse = new bootstrap.Collapse(myCollapse, {
          toggle: false
        });
        bsCollapse.toggle(); 

    }else{
      console.log("error");
    }
  };
 
});

// fix the navigation bar ('header-nav') if the screen width is less than 768
const fixedHeader = {
  el:  document.getElementById("header-nav"),
  nonFixed() {
    this.el.classList.remove('fixed-top');
  },
  Fixed() {
    this.el.classList.add('fixed-top');
  },
  addEventListener() {   
    var screenWidth = window.innerWidth;
    screenWidth < 768 ? this.nonFixed() : this.Fixed();
  }
}

fixedHeader.addEventListener();

// Button "on Top"
const btnUp = {
  el:  document.getElementById("button_up"),
  el_big:  document.getElementById("button_up_big"),
  show() {
    // delete class 'btn-up_hide' from button
    this.el.classList.remove('btn-up_hide');
    this.el_big.classList.remove('btn-up_hide');
  },
  hide() {
    // add class 'btn-up_hide' to button
    this.el.classList.add('btn-up_hide');
    this.el_big.classList.add('btn-up_hide');
  },
  addEventListener() {
    // when scrolling page
    window.addEventListener('scroll', () => {
      // determine the amount of scrolling
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // if the page is scrolled more than 400px, then we make the button visible, otherwise we hide it
      scrollY > 400 ? this.show() : this.hide();
    });
    // when you press a button "button_up"
    document.getElementById("button_up").onclick = () => {
      // move to the top of the page
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
    // when you press a button "button_up_big"
    document.getElementById("button_up_big").onclick = () => {
      // move to the top of the page
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}

btnUp.addEventListener();
// End button "on Top"

(function (global) {
  var Obj = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "json/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "json/menu_items.json";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
  var aboutHtml = "snippets/about-snipet.html";
  var specialsHtml = "snippets/specials.html";
  var cookieInfoHtml = "snippets/cookie_info.html";
 
  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };
   
  // Return substitute of '{{propName}}' with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Remove the class 'active' 
  var switchMenuToActive = function () {
    // Remove 'active' from home/about/specials buttons
    var classes = document.querySelector("#navHomeButton").className;
    if (classes.indexOf("active") >= 1) {
      classes = classes.replace(new RegExp("active", "g"), "");
    }
    document.querySelector("#navHomeButton").className = classes;
    document.querySelector("#navAboutButton").className = classes;
    document.querySelector("#navSpecialsButton").className = classes;

    // Add 'active' to Menu button if not already there
    classes = document.querySelector("#navMenuButton").className;

    if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;    
    }
  };

  // Remove the class 'active' 
  var switchAboutToActive = function () {
    // Remove 'active' from home/menu/specials buttons
    var classes = document.querySelector("#navHomeButton").className;
    if (classes.indexOf("active") >= 1) {
      classes = classes.replace(new RegExp("active", "g"), "");
    }
    document.querySelector("#navHomeButton").className = classes;
    document.querySelector("#navMenuButton").className = classes;
    document.querySelector("#navSpecialsButton").className = classes;

    // Add 'active' to About button if not already there
    classes = document.querySelector("#navAboutButton").className;

    if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navAboutButton").className = classes;    
    };
  };

    // Remove the class 'active' 
    var switchSpecialsToActive = function () {
      // Remove 'active' from home/menu/about buttons
      var classes = document.querySelector("#navHomeButton").className; 
      if (classes.indexOf("active") >= 1) {
        classes = classes.replace(new RegExp("active", "g"), "");
      }    
      document.querySelector("#navHomeButton").className = classes;
      document.querySelector("#navMenuButton").className = classes;
      document.querySelector("#navAboutButton").className = classes;
  
      // Add 'active' to Specials button if not already there
      classes = document.querySelector("#navSpecialsButton").className;
  
      if (classes.indexOf("active") == -1) {
        classes += " active";
        document.querySelector("#navSpecialsButton").className = classes;    
      }
    };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    // On first load, show home view
    showLoading("#main-content");     
    Global_ajaxUtils.sendGetRequest(homeHtmlUrl, buildAndShowHomeHTML, false); 
  });

  function buildAndShowHomeHTML (homeHtmlUrl) {     
    insertHtml("#main-content", homeHtmlUrl);
  };

  // Load the page About
  Obj.loadAbout = function () {
    showLoading("#main-content");
    Global_ajaxUtils.sendGetRequest(aboutHtml, buildAndShowAboutHTML, false);
    window.scrollBy(0, -window.innerHeight);
  };

  function buildAndShowAboutHTML (aboutHtml) { 
    switchAboutToActive(); 
    insertHtml("#main-content", aboutHtml);  
  };

    // Load the page Cookie_info
    Obj.loadCookieInfo = function () {
      showLoading("#main-content");
      Global_ajaxUtils.sendGetRequest(cookieInfoHtml, buildAndShowCookieInfoHTML, false);
      window.scrollBy(0, -window.innerHeight);
    };
  
    function buildAndShowCookieInfoHTML (cookieInfoHtml) { 
      insertHtml("#main-content", cookieInfoHtml);  
    };

   // Load the page Specials 
   Obj.loadSpecials = function () {  
    showLoading("#main-content");
    Global_ajaxUtils.sendGetRequest(specialsHtml, buildAndShowSpecialsHTML, false);
    window.scrollBy(0, -window.innerHeight);   
  };  
 
   function buildAndShowSpecialsHTML (specialsHtml) { 
    switchSpecialsToActive(); 
    insertHtml("#main-content", specialsHtml);     
  }; 

  // Load the menu categories view
  Obj.loadMenuCategories = function () {
    showLoading("#main-content");
    Global_ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    window.scrollBy({
      top: -window.innerHeight,
      left: 0,
      behavior: 'smooth'
    })
  };

  Obj.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    Global_ajaxUtils.sendGetRequest(menuItemsUrl, function (Ob) {
      buildAndShowMenuItemsHTML (Ob[categoryShort]);  
    }); 
  }; 

 
  // Builds HTML for the categories page based on the data from the server
  function buildAndShowCategoriesHTML(categories) {
    // Load title snippet of categories page
    Global_ajaxUtils.sendGetRequest(

      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        Global_ajaxUtils.sendGetRequest(

          categoryHtml,
          function (categoryHtml) {
             switchMenuToActive();

            var categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );
            insertHtml("#main-content", categoriesViewHtml);
          },
          false
        );
      },
      false
    );
  }

  // Using categories data and snippets html build categories view HTML to be inserted into page
  function buildCategoriesViewHtml(
    categories,
    categoriesTitleHtml,
    categoryHtml
  ) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the single category page based on the data from the server
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    // Load title snippet of menu items page
    Global_ajaxUtils.sendGetRequest(

      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        // Retrieve single menu item snippet
        Global_ajaxUtils.sendGetRequest(

          menuItemHtml,
          function (menuItemHtml) {
            // Switch CSS class active to menu button
            switchMenuToActive();
            var menuItemsViewHtml = buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml
            );
            insertHtml("#main-content", menuItemsViewHtml);
            window.scrollTo(0, -window.innerHeight);            
            var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
            var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
              return new bootstrap.Popover(popoverTriggerEl)
            })             
          },
          false
        );
      },
      false
    );
  }

  // Using category and menu items data and snippets html
  // build menu items view HTML to be inserted into page
  function buildMenuItemsViewHtml(
    categoryMenuItems,
    menuItemsTitleHtml,
    menuItemHtml
  ) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name
    );
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions
    );

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over menu items
    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    for (var i = 0; i < menuItems.length; i++) {
      // Insert menu item values
      var html = menuItemHtml;

      //Add popover (prompt) if ingredients and composition are not empty
      var img_popover = "data-bs-toggle='popover' data-bs-content='{{ingredients}} {{composition}}'  title='Ingredients and Composition:' data-bs-custom-class='custom-popover' data-bs-trigger='hover' data-bs-placement='bottom'";
      if ((menuItems[i].ingredients || menuItems[i].composition) !=false) {      
       html = insertProperty(html, "img_popover", img_popover);       
      }  
      else {
        html = insertProperty(html, "img_popover", "");
      }     

      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small); //with the addition of a "euro" sign
      html = insertItemWithBrackets(html, "small_portion_name", menuItems[i].small_portion_name); // if the value is not empty, it is printed in parentheses
      html = insertItemPrice(html, "price_large", menuItems[i].price_large); //with the addition of a "euro" sign
      html = insertItemWithBrackets(html, "large_portion_name", menuItems[i].large_portion_name);
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertItemWithoutBrackets(html, "description", menuItems[i].description); // if the value is not empty, then it is printed without parentheses
      html = insertItemWithoutBrackets(html, "ingredients", menuItems[i].ingredients); // if the value is not empty, then it is printed without parentheses
      html = insertItemWithoutBrackets(html, "composition", menuItems[i].composition); // if the value is not empty, then it is printed without parentheses
      html = insertItemWithoutBrackets(html, "weight", menuItems[i].weight); // if the value is not empty, then it is printed without parentheses
      html = insertItemWithBrackets(html, "quantity", menuItems[i].quantity); // if the value is not empty, it is printed in parentheses

    
      // Add clearfix after every second menu item
      // Clearfix property clear all the floated content of the element that it is applied to
      if (i % 2 != 0) {
        html +=
          "<div class='clearfix visible-lg-block visible-md-block'></div>";
      }

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;    
  }

  // Appends price with '€' if price exists
  function insertItemPrice(html, pricePropName, priceValue) {
    // If not specified, replace with empty string
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }

    priceValue = "€" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  // Appends Item in parens if it exists
  function insertItemWithBrackets(html, portionPropName, portionValue) {
    // If not specified, return original string
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

  // Appends Item without brackets if it exists
  function insertItemWithoutBrackets(html, portionPropName, portionValue) {
    // If not specified, return original string
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }
    
  global.Global_Obj = Obj;

})(window);