const bubbles = document.querySelectorAll(".bubble");
const field = document.querySelector("#bubble-page");
const memberBubbles = [...document.querySelectorAll(".team-bubble")];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPositionBubble(bubble) {
  const maxX = window.innerWidth - bubble.offsetWidth;
  const maxY = window.innerHeight - bubble.offsetHeight;

  bubble.style.left = `${randomBetween(0, maxX)}px`;
  bubble.style.top = `${randomBetween(0, maxY)}px`;
  bubble.style.setProperty("--duration", `${randomBetween(5, 9)}s`);
  bubble.style.setProperty("--delay", `${randomBetween(0, 2)}s`);
  bubble.style.setProperty("--x-movement", `${randomBetween(-45, 45)}px`);
  bubble.style.setProperty("--y-movement", `${randomBetween(-35, 35)}px`);
}

function isActiveMember(bubble) {
  return bubble.isConnected &&
    bubble.style.display !== "none" &&
    !bubble.classList.contains("popping");
}

function findDroppedOnMemberBubble(bubble, event) {
  return document.elementsFromPoint(event.clientX, event.clientY)
    .find((element) =>
      element !== bubble &&
      memberBubbles.includes(element) &&
      isActiveMember(element)
    );
}

function restoreMemberBubbles(sharedBubble, first, second) {
  sharedBubble.remove();
  [first, second].forEach((member) => {
    member.style.display = "grid";
    delete member.dataset.combined;
    member.classList.remove("popping", "dragging", "entering");
    member.classList.add("entering");
  });

  // when restored, random position
  first.style.left = `${randomBetween(0, window.innerWidth - 280)}px`;
  first.style.top = `${randomBetween(0, window.innerHeight - 280)}px`;
  second.style.left = `${randomBetween(0, window.innerWidth - 280)}px`;
  second.style.top = `${randomBetween(0, window.innerHeight - 280)}px`;
}

// dragging functionality
function enableDragging(bubble, onRelease) {
  let grabOffsetX;
  let grabOffsetY;
  let dragged = false;

  bubble.addEventListener("pointerdown", (event) => {
    const rectangle = bubble.getBoundingClientRect();

    grabOffsetX = event.clientX - rectangle.left;
    grabOffsetY = event.clientY - rectangle.top;
    dragged = false;

    bubble.style.left = `${rectangle.left}px`;
    bubble.style.top = `${rectangle.top}px`;
    bubble.classList.remove("entering", "floating");
    bubble.classList.add("dragging");
    bubble.setPointerCapture(event.pointerId);
  });

  bubble.addEventListener("pointermove", (event) => {
    if (!bubble.hasPointerCapture(event.pointerId)) {
      return;
    }

    const newLeft = event.clientX - grabOffsetX;
    const newTop = event.clientY - grabOffsetY;

    if (Math.abs(newLeft - bubble.offsetLeft) > 5 ||
        Math.abs(newTop - bubble.offsetTop) > 5) {
      dragged = true;
    }

    bubble.style.left = `${newLeft}px`;
    bubble.style.top = `${newTop}px`;
  });

  bubble.addEventListener("pointerup", (event) => {
    bubble.releasePointerCapture(event.pointerId);
    bubble.classList.remove("dragging");
    bubble.dataset.dragged = String(dragged);
    onRelease?.(dragged, event);
  });
}

/* currently just adapted to two bubbles 
   NEEDS to be for any number of bubbles */ 
function combineMemberBubbles(first, second) {
  const sharedBubble = document.createElement("button");

  // logic to pop the two bubbles
  first.classList.remove("floating", "dragging");
  second.classList.remove("floating", "dragging");
  first.dataset.combined = "true";
  second.dataset.combined = "true";
  first.classList.add("popping");
  second.classList.add("popping");

  // combined bubble enters screen
  sharedBubble.className = "bubble team-bubble shared-bubble entering";
  sharedBubble.textContent = `${first.dataset.member} + ${second.dataset.member}`;
  sharedBubble.style.left = `${randomBetween(0, window.innerWidth - 280)}px`;
  sharedBubble.style.top = `${randomBetween(0, window.innerHeight - 280)}px`;

  // combined bubble also floats around
  sharedBubble.style.setProperty("--duration", `${randomBetween(5, 9)}s`);
  sharedBubble.style.setProperty("--delay", `${randomBetween(0, 2)}s`);
  sharedBubble.style.setProperty("--x-movement", `${randomBetween(-45, 45)}px`);
  sharedBubble.style.setProperty("--y-movement", `${randomBetween(-35, 35)}px`);
  
  // adds this combined bubble to the page
  field.appendChild(sharedBubble);

  sharedBubble.addEventListener("animationend", (event) => {
    if (event.animationName === "appear") {
      sharedBubble.classList.remove("entering");
      sharedBubble.classList.add("floating");
    }
  });

  enableDragging(sharedBubble, () => {
    sharedBubble.classList.add("floating");
  });

  sharedBubble.addEventListener("dblclick", () => {
    if (sharedBubble.classList.contains("popping")) {
      return;
    }

    sharedBubble.classList.remove("floating", "entering", "dragging");
    sharedBubble.classList.add("popping");
    sharedBubble.addEventListener("animationend", (event) => {
      if (event.animationName === "pop") {
        restoreMemberBubbles(sharedBubble, first, second);
      }
    }, { once: true });
  });
}

bubbles.forEach((bubble) => {
  randomPositionBubble(bubble);
  bubble.classList.add("entering");

  bubble.addEventListener("animationend", (event) => {
    if (event.animationName === "appear") {
      bubble.classList.remove("entering");
      bubble.classList.add("floating");
    }

    if (event.animationName === "pop" && bubble.dataset.combined !== "true") {
      randomPositionBubble(bubble);
      bubble.classList.remove("popping");
      bubble.classList.add("entering");
    }
  });
});

memberBubbles.forEach((bubble) => {
  bubble.addEventListener("dblclick", () => {
    bubble.classList.remove("floating", "entering", "dragging");
    bubble.classList.add("popping");
  });

  enableDragging(bubble, (dragged, event) => {
    const droppedOnMemberBubble = dragged
      ? findDroppedOnMemberBubble(bubble, event)
      : null;

    // if dragged onto a member, combine, otherwise keep floating
    if (droppedOnMemberBubble) {
      combineMemberBubbles(bubble, droppedOnMemberBubble);
    } else {
      bubble.classList.add("floating");
    }
  });
});
