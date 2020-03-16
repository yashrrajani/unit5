$(document).ready(function()
{
  ///////////////////////////////////
  /// GLOBAL VARIABLE DECLARATION ///
  ///////////////////////////////////
  
  const search = $(".search-container"); //creating search bar
  let form = document.createElement("form"); //page form
  let card = []; //card of employee
  let modal = []; //modal


  //////////////////////////////////
  // GETTING EMPLOYEE INFORMATION //
  //////////////////////////////////
  
  /**
   *
   *
   * @param {Object} data
   */
  function generateInformation(data)
  {
    data.forEach((user, index) =>
    {
      let employeeGallery = $("#gallery"); //gallery of randomly-generated employees
      let dob = user.dob.date.slice(5,7) + "-" + user.dob.date.slice(8,10) + "-" + user.dob.date.slice(0, 4); //formatting of user date of birth
    

      cardInfo = $(`
        <div class="card" id="${index}">
          <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
          </div>
          <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
              <p class="card-text">${user.email}</p>
              <p class="card-text">${user.location.city}, ${user.location.state}</p>
          </div>
        </div>
      `);//card contents on the page


      modalInfo = $(`
        <div class="modal-container" href="${index}">
          <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
              <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">Email: ${user.email}</p>
                <p class="modal-text">Phone: ${user.phone}</p>
                <p class="modal-text">Address: ${user.location.street}, ${user.location.city}, ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${dob} </p>
              </div>
            </div>
            <div class="modal-btn-container">
              <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
              <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
      `); //information on the page in the right spots

      employeeGallery.append(cardInfo); //append boxes
      employeeGallery.append(modalInfo); //insert information

      $(".modal-container").hide(); //hide popup

    });

    $(".card").click((event) =>
    {
      let selectedEmployeeCard = $(event.target).closest(".card"); //show ".closest" selected card. online reference. very helpful

      if (event.type === "click")
      {
        $(`[href = '${selectedEmployeeCard[0].id}']`).show(); //show if clicked
        iterateThroughModals(); //allow navigation functionality
      }
    });

  }


  //////////////////////////////////////////
  // SHIFT BETWEEN EMPLOYEES IN DIRECTORY //
  //////////////////////////////////////////

  function iterateThroughModals () //function to sort between pop up pages
  {
    const close = $("#modal-close-btn"); //create var for x button
    const previousModal = $("#modal-prev"); //create var for previous button
    const nextModal = $("#modal-next"); //create var for next button

    $("#modal-close-btn").click(function() { 
      $(".modal-container").hide(); //close pop up on click of x button
      console.log('closed'); //checking
    });
    
    $("[type = 'button']").click(function(event) //get all button commands
    {
      let selectedButton = $(event.target).closest("[type='button']"); //.closest function found online as reference. very helpful to grab nearest selected element
      let currentCard = $(event.target).closest(".modal-container");
      let getCard = $(".modal-container")[0].getAttribute("href"); 
      let num = parseInt(currentCard[0].getAttribute("href")); //count of selected modal on array

      if (selectedButton[0].id === "modal-close-btn") {
        $(".modal-container").hide(); //hide current
        num = 0; //reset count to 0
      }
      else if (selectedButton[0].id === "modal-prev") {
        currentCard.hide(); //hide current

        if (num === 0) {
          $("[href = '11']").show(); //go back to last one if on first
        } else {
          num--;; //otherwise subtract count by one
          $(`[href = '${num}']`).show(); //and show the popup of new count in array
        };
      }
      else if (selectedButton[0].id === "modal-next")
      {
        currentCard.hide(); //hide current

        if (num === 11) { //show first if on last 
          $("[href = '0']").show(); 
        } else
        {
          num++; //add one to count
          $(`[href = '${num}']`).show(); //show new popup of count in array
        }
      }
    });
  }



/////////////////////////
//// FETCH USER DATA ////
/////////////////////////

  fetch('https://randomuser.me/api/?results=12&nat=gb&inc=name,email,location,phone,picture,dob') //api link
    .then(response => response.json()) //get response from json
    .then(data => generateInformation(data.results)) //based on above command
    .catch(error => console.error(error)) //catch any errors
  ; 


//////////////////////////////
// SEARCH BAR FUNCTIONALITY //
//////////////////////////////

  form.innerHTML = `
   <input type="text" id="search-input" class="search-input" placeholder="Search...">
   <input type="submit" id="search-submit" class="search-submit">
   `; //create search bar
  search.append(form); //append search bar form to page

  const filterThroughList = function() {
    let input = $("#search-input")[0].value.toLowerCase(); //user input

    for (let i = 0; i < $(".card").length; i ++) {
      const nameHolder = $(".card")[i]; //index of user input
      const name = nameHolder.innerHTML.toLowerCase(); //convert for formatting

      if (name.indexOf(input) > -1) { //if it appears in employee directory
        nameHolder.closest(".card").style.display = ""; //show
      } else {
        nameHolder.closest(".card").style.display = "none"; //otherwise, hide
      }
    }

  };

  search.on('keyup', filterThroughList); //actually call the search bar function


}); // end of program