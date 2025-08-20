// Memory Match - simple implementation
(function(){
  const EMOJIS = ['🐶','🐱','🦊','🐼','🦁','🐸','🐵','🐔','🐙','🦄','🐷','🐻']; // 12 unique
  const boardEl = document.getElementById('board');
  const movesEl = document.getElementById('moves');
  const timeEl = document.getElementById('time');
  const matchesEl = document.getElementById('matches');
  const restartBtn = document.getElementById('restart');

  let deck = [];
  let firstCard = null, secondCard = null;
  let lock = false;
  let moves = 0, matches = 0;
  let timer = null, seconds = 0, started = false;

  function format(t){
    const mm = String(Math.floor(t/60)).padStart(2,'0');
    const ss = String(t%60).padStart(2,'0');
    return `${mm}:${ss}`;
  }

  function startTimer(){
    if(started) return; started = true;
    timer = setInterval(()=>{ seconds++; timeEl.textContent = format(seconds); },1000);
  }

  function stopTimer(){ clearInterval(timer); timer=null; started=false; }

  function shuffle(a){
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function buildDeck(){
    // take 12 pairs for a full board (adjustable)
    const pairs = 12; // full set of 12 pairs -> 24 cards
    const slice = EMOJIS.slice(0, pairs);
    deck = shuffle([...slice, ...slice]);
  }

  function render(){
    boardEl.innerHTML = '';
    deck.forEach((value, idx)=>{
      const card = document.createElement('button');
      card.className = 'card';
      card.setAttribute('data-value', value);
      card.setAttribute('aria-label','Memory card');
      card.innerHTML = `
        <div class="inner">
          <div class="face front">${value}</div>
          <div class="face back"></div>
        </div>`;
      card.addEventListener('click', ()=>onCardClick(card));
      boardEl.appendChild(card);
    });
    moves = 0; matches = 0; seconds = 0; stopTimer();
    movesEl.textContent = moves; matchesEl.textContent = matches; timeEl.textContent = format(seconds);
  }

  function resetBoardState(){ firstCard = null; secondCard = null; lock = false; }

  function onCardClick(card){
    if(lock || card.classList.contains('flipped') || card.classList.contains('disabled')) return;
    startTimer();
    card.classList.add('flipped');
    if(!firstCard){ firstCard = card; return; }
    secondCard = card; lock = true; moves++; movesEl.textContent = moves;

    const a = firstCard.getAttribute('data-value');
    const b = secondCard.getAttribute('data-value');
    if(a === b){
      // match
      firstCard.classList.add('disabled');
      secondCard.classList.add('disabled');
      matches++;
      matchesEl.textContent = matches;
      resetBoardState();
      if(matches === deck.length/2){
        stopTimer();
        setTimeout(()=>alert(`You won! Time: ${format(seconds)}, Moves: ${moves}`),200);
      }
    } else {
      // not a match
      setTimeout(()=>{
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoardState();
      },600);
    }
  }

  function restart(){
    buildDeck(); render();
  }

  restartBtn.addEventListener('click', restart);

  // init
  buildDeck(); render();

})();
