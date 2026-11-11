// Tutorial tips spoken in waves 1 and 2 (see waveTips() in main.js). Text differs between desktop and phone (IS_TOUCH).
// Numbers are written out as words so the speech synthesis reads them well.
addLines('pl', {
  tipAim: [
    [['artur', () => IS_TOUCH
      ? 'Rycerzu, słuchaj instrukcji: prawym kciukiem rozglądasz się i celujesz, dużym przyciskiem strzelasz, a ikonami na dole zmieniasz broń.'
      : 'Rycerzu, słuchaj instrukcji: mysz celuje, lewy przycisk strzela, a klawisze od jeden do dziewięć zmieniają broń.'],
      ['patsy', 'A kokosy, panie? Do rzucania?'], ['artur', 'Kokosy zostaw na bardziej dramatyczne chwile.']],
    ['gandalf', 'Łuk, kusza i moździerz nic nie kosztują. Czary zużywają manę, więc nie szalej, bo w najgorszej chwili zostanie ci kij i dobre nastawienie.'],
    [['robin', 'Panie, jak się celuje, żeby nie trafić w siebie? Pytam dla kolegi.'],
      ['artur', () => IS_TOUCH ? 'Prawym kciukiem przesuwaj celownik, a dużym przyciskiem strzelaj. Wspomaganie celowania pomoże, kolego.' : 'Poruszaj myszą, a strzelaj lewym przyciskiem. Strzały lecą do przodu. Zwykle.']],
  ],
  tipDefender: [
    [['artur', () => IS_TOUCH
      ? 'Rycerzu, możesz przywołać obrońcę! Przytrzymaj palec na ikonie broni na dole, aż zapełni się kółko. Stanie na murze i będzie strzelał sam.'
      : 'Rycerzu, możesz przywołać obrońcę! Przytrzymaj Shift i naciśnij cyfrę broni. Stanie na murze i będzie strzelał sam.'],
      ['lancelot', 'Ile to kosztuje?'], ['artur', 'Najtańszy łucznik to sto dwadzieścia złota. Zbieraj monety, Lancelocie.']],
    [['dennis', 'Przywołują człowieka na mur jak psa! Co za wyzysk!'], ['artur', 'Dostanie wypłatę w chwale, Dennis.'],
      ['dennis', () => IS_TOUCH ? 'Dobrze, to ja pokażę wszystkim: przytrzymać ikonę broni na dole, aż kółko się zamknie. I niech nikt nie mówi, że nie pomagam.' : 'Dobrze, to ja pokażę wszystkim: Shift i cyfra broni. I niech nikt nie mówi, że nie pomagam.']],
    ['galahad', () => IS_TOUCH
      ? 'Wskazówka od czystego rycerza: przytrzymaj ikonę broni, a przywołasz obrońcę z tą samą bronią. Pasek życia nosi nad głową, bo jest skromny.'
      : 'Wskazówka od czystego rycerza: Shift i cyfra broni przywołują obrońcę z tą samą bronią. Pasek życia nosi nad głową, bo jest skromny.'],
  ],
  tipDefenderB: [
    [['maynard', 'Bracia, o obrońcach pamiętajcie trzy rzeczy: cena rośnie z każdym nowym, na murach mieści się ich szesnastu, a leczy ich dziewiąty czar.'],
      ['robin', 'Trzy! Nie pięć!'], ['maynard', 'Pięć odpada, Robinie.']],
    ['czarny', 'Obrońcy mają własne paski życia. Jak któryś straci rękę, to tylko zadrapanie. Ale uleczyć go warto dziewiątką.'],
  ],
  tipShop: [
    [['artur', () => IS_TOUCH
      ? 'Skarbiec jest pełny! Na prawo na górze są trzy przyciski: klucz naprawia wieżę, serce daje więcej życia, a kula więcej many.'
      : 'Skarbiec jest pełny! Klawisz R naprawia wieżę, T daje więcej życia, a Y więcej many. Cena jest przy każdym.'],
      ['patsy', 'Mogę kupić mydło?'], ['artur', 'Nie, Patsy.']],
    ['vizzini', () => IS_TOUCH
      ? 'Radzę wydać złoto rozsądnie: klucz naprawia wieżę, a serce i kula dodają życie i manę. Mówiłem, że przemyślałem wszystko!'
      : 'Radzę wydać złoto rozsądnie: R naprawia wieżę, T i Y dodają życie i manę. Mówiłem, że przemyślałem wszystko!'],
  ],
  tipMana: [
    [['gandalf', () => IS_TOUCH
      ? 'Dziewiąta ikona to święte uzdrowienie. Leczy wieżę, ciebie i obrońców. Użyj jej, zanim będzie za późno.'
      : 'Klawisz dziewięć to święte uzdrowienie. Leczy wieżę, ciebie i obrońców. Użyj go, zanim będzie za późno.'],
      ['sam', 'Szkoda, że nie ma wersji z ziemniakami, panie.']],
    ['tim', 'Mana odnawia się sama, a ulepszenie podnosi jej limit i tempo. Tak się rzuca czary, rycerze! I mam do tego rogi.'],
  ],
});
addLines('en', {
  tipAim: [
    [['artur', () => IS_TOUCH
      ? 'Listen up, knight: your right thumb looks and aims, the big button shoots, and the icons along the bottom change weapons.'
      : 'Listen up, knight: the mouse aims, the left button shoots, and the number keys one to nine change weapons.'],
      ['patsy', 'And the coconuts, sire? For throwing?'], ['artur', 'Save the coconuts for a more dramatic moment.']],
    ['gandalf', 'The bow, the crossbow and the mortar are free. Spells cost mana, so do not squander it, or you will be left with a stick and a positive attitude.'],
    [['robin', 'Sire, how does one aim without hitting oneself? Asking for a friend.'],
      ['artur', () => IS_TOUCH ? 'Drag your right thumb to move the sights and press the big button to shoot. Aim assist will help, friend.' : 'Move the mouse and shoot with the left button. Arrows go forward. Usually.']],
  ],
  tipDefender: [
    [['artur', () => IS_TOUCH
      ? 'Knight, you can summon a defender! Hold a finger on a weapon icon at the bottom until the ring fills. He will stand on the wall and shoot on his own.'
      : 'Knight, you can summon a defender! Hold Shift and press a weapon number. He will stand on the wall and shoot on his own.'],
      ['lancelot', 'How much does that cost?'], ['artur', 'The cheapest archer is one hundred and twenty gold. Collect the coins, Lancelot.']],
    [['dennis', 'Dragging a man onto a wall like a dog! What exploitation!'], ['artur', 'He will be paid in glory, Dennis.'],
      ['dennis', () => IS_TOUCH ? 'Fine, then I will show everyone: hold a weapon icon at the bottom until the ring closes. And nobody says I am unhelpful.' : 'Fine, then I will show everyone: Shift and a weapon number. And nobody says I am unhelpful.']],
    ['galahad', () => IS_TOUCH
      ? 'A tip from the pure knight: hold a weapon icon, and a defender with that very weapon appears. He wears his life bar above his head, out of modesty.'
      : 'A tip from the pure knight: Shift and a weapon number summon a defender with that very weapon. He wears his life bar above his head, out of modesty.'],
  ],
  tipDefenderB: [
    [['maynard', 'Brethren, remember three things about defenders: the price rises with each one, the walls hold sixteen, and the ninth spell heals them.'],
      ['robin', 'Three! Not five!'], ['maynard', 'Five is right out, Robin.']],
    ['czarny', 'Defenders have life bars of their own. If one loses an arm, it is only a scratch. But a ninth-spell heal is still wise.'],
  ],
  tipShop: [
    [['artur', () => IS_TOUCH
      ? 'The treasury is full! Top right are three buttons: the wrench repairs the tower, the heart adds life, and the orb adds mana.'
      : 'The treasury is full! R repairs the tower, T adds life, and Y adds mana. The price is shown beside each.'],
      ['patsy', 'May I buy soap?'], ['artur', 'No, Patsy.']],
    ['vizzini', () => IS_TOUCH
      ? 'I advise spending the gold wisely: the wrench repairs the tower, and the heart and orb add life and mana. I told you I had thought of everything!'
      : 'I advise spending the gold wisely: R repairs the tower, and T and Y add life and mana. I told you I had thought of everything!'],
  ],
  tipMana: [
    [['gandalf', () => IS_TOUCH
      ? 'The ninth icon is holy healing. It mends the tower, you and your defenders. Use it before it is too late.'
      : 'The number nine key is holy healing. It mends the tower, you and your defenders. Use it before it is too late.'],
      ['sam', 'Pity there is no version with potatoes, Mr. Frodo.']],
    ['tim', 'Mana comes back on its own, and the upgrade raises both its limit and its pace. That is how one casts spells, knights! Also, I have horns.'],
  ],
});
