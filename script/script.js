class Item {
  constructor(name, comments) {
    this.name = name;
    this.comments = comments;
  }
  id;
  name;
  username;
  comments;
}

const itemTableName = "items";
let clickedId;

document.addEventListener("DOMContentLoaded", () => {
  loadItems();
});

const loadItems = () => {
  const items = getItems();
  let html = "";
  if (!items) {
    return false;
  }
  items.forEach((element) => {
    html += getHtmlItem(element);
  });
  const element = document.getElementsByClassName("items__tasks")[0];
  element.innerHTML = html;
};

const addItemOnClick = () => {
  const element = document.getElementsByClassName("items__inputBox-input")[0];
  if (element && element.value.length > 0) {
    const name = element.value;
    addItem(name, []);
    element.value = "";
  }
};

const deleteItemOnClick = (element) => {
  const parentId = element.parentNode.id;
  deleteItem(parentId);
};

const showItemComments = (id) => {
  clickedId = id;
  const items = getItems();
  const element = document.getElementById("comments");
  const selectedItem = items.find((i) => i.id == clickedId);
  loadItems();
  let html = "";
  if (selectedItem?.comments.length > 0) {
    html += `<h2 class="comments__title">Comments #<span>${id}</span></h2>`;
    selectedItem?.comments.forEach(
      (comment) => (html += getCommentsHtml(comment, id))
    );
  } else {
    html += `<h2 class="comments__title">No Comments #<span>${id}</span></h2>`;
  }
  html += `<div class="comments__textarea">
      <div class="comments__textarea-photo"></div>
      <textarea class="comments__textarea-input" id="comments__textarea-input" onkeypress="addComment()"></textarea>
    </div>`;
  element.innerHTML = html;
};

const addComment = () => {
  const key = window.event;

  if (key.keyCode === 10 && key.target.value.length > 0) {
    // 13 - Enter
    window.event.preventDefault();
    const items = getItems();
    const selectedItem = items.find((i) => i.id == clickedId);
    const element = document.getElementById("comments__textarea-input");
    selectedItem?.comments.push(element.value);
    saveTable(items);
    loadItems();
    const selectedTask = document.querySelector(
      ".items__tasks-element-selected"
    );
    showItemComments(selectedTask?.id);
    element.value = "";
  }
};

const addItem = (name, comments) => {
  const item = new Item(name, comments);
  saveItem(item);
  loadItems();
};

const saveItem = (item) => {
  let items = getItems();
  if (items) {
    item.id = items[items.length - 1]?.id + 1;
    items.push(item);
  } else {
    item.id = 1;
    items = [item];
  }
  saveTable(items);
};

const saveTable = (items) => {
  localStorage.setItem(itemTableName, JSON.stringify(items));
};

const deleteItem = (id) => {
  let items = getItems();
  items = items.filter((i) => i.id != id);
  document.getElementById(id).remove();
  saveTable(items);
};

const getItems = () => {
  return JSON.parse(localStorage.getItem(itemTableName));
};

const getCountsComments = (id) => {
  return true;
};

function getHtmlItem(item) {
  return `<div id =${item.id} class="${
    item.id == clickedId
      ? "items__tasks-element-selected"
      : "items__tasks-element"
  }" onclick="showItemComments(this.id)">
    <div class="items__tasks-element__inner">
      <div class="items__tasks-element__inner__title">${item.name}</div>
      <div class="items__tasks-element__inner__comments-count">${
        item?.comments.length
      }</div>
    </div>
    <button class="items__tasks-element__button-delete" onclick="deleteItemOnClick(this)">Delete</button>
  </div>`;
}

const getCommentsHtml = (comment, commentId) => {
  return `<div class="comments__element__inner">
      <div class="comments__element__inner-photo"></div>
      <div class="comments__element__inner-text">${comment}</div>
    </div>
    <hr>
  </div>`;
};

function buttonStatus() {
  const input = document.getElementsByName("tasks")[0];
  const button = document.getElementsByClassName("items__inputBox-button-add");
  input.value.length > 0 ? (button.disabled = true) : (button.disabled = false);
}

document
  ?.getElementById("comments__textarea-input")
  ?.addEventListener("keypress-input", addComment);
