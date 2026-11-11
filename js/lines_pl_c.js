// Kwestie PL, część C: nowi bohaterowie komentują zdarzenia (Księżniczka Narzeczona, Władca Pierścieni, Pratchett)
addLines('pl', {
  start: [
    [['inigo', 'Witam. Nazywam się Inigo Montoya. Będę dziś bronił tej wieży.'], ['vizzini', 'Niemożliwe! Kto go zatrudnił?!']],
    [['gandalf', 'Wieża jest chroniona. Nikt nie przejdzie, dopóki ja tu stoję.'], ['rincewind', 'A ja stoję obok i drżę. Dla równowagi.']],
  ],
  waveStart: [
    ['vizzini', c => `Fala ${c.o}! Niemożliwe! Znowu oni! Wiedziałem, że przyjdą. Wiedziałem, że wiedziałem!`],
    ['gandalf', c => `Fala ${c.o}. Nie przejdziecie! A przynajmniej nie wszyscy.`],
    ['sam', c => `Fala ${c.o}, panie. Przynajmniej mamy ziemniaki.`],
    ['gimli', c => `Fala ${c.o}! Nikt nie rzuca krasnoludem! No, chyba że sam o to poprosi.`],
    ['rincewind', c => `Fala ${c.o}! Zanim zacznie się walka, chciałbym zgłosić ucieczkę.`],
    ['legolas', c => `Fala ${c.o}. Czuję zło. I ludzki pot. Jedno i drugie nieprzyjemne.`],
  ],
  waveClear: [
    ['gandalf', c => `Fala ${c.o} odparta. Premia w złocie: ${c.p}. Wydajcie ją mądrze, klawiszami R, T lub Y.`],
    ['sam', c => `Koniec fali ${c.o}. Mamy złota: ${c.p}. Starczy na drugi garnek, panie!`],
    ['vizzini', c => `Fala ${c.o} odparta! Moja zasługa! Dzięki mojemu planowi. Którego nie mam.`],
    ['rincewind', c => `Fala ${c.o} przeżyta! I to bez ani jednego sprintu. Cud. Złota: ${c.p}.`],
    ['gimli', c => `Fala ${c.o} za nami! Złota: ${c.p}! Prawdziwe złoto, a nie jakiś mithril!`],
  ],
  orkCall: [
    ['gimli', c => `Orkowie od ${c.d}! Mam świeżo naostrzony topór, a oni świeże szyje!`],
    ['legolas', c => `Orkowie od ${c.d}. Liczę na nowy rekord.`],
    ['gandalf', c => `Orkowie od ${c.d}. Pamiętajcie, to tylko orkowie, nie Balrog. Choć nigdy nie wiadomo.`],
    ['sam', c => `Orkowie od ${c.d}, panie. Czy mogę najpierw dokończyć obiad?`],
  ],
  goblinCall: [
    ['gandalf', c => `Gobliny od ${c.d}! Jak zwykle: dużo hałasu, mało rozumu.`],
    ['inigo', c => `Gobliny od ${c.d}. Nie jestem pewien, czy trzymam miecz, czy nóż do chleba.`],
    ['rincewind', c => `Gobliny od ${c.d}! Jest ich mnóstwo. Statystycznie to fatalnie.`],
  ],
  thiefCall: [
    ['sam', c => `Złodziej od ${c.d}! Panie Frodo, niech pan pilnuje pierścienia!`],
    ['inigo', c => `Złodziej od ${c.d}! Wygląda jak Vizzini w przebraniu.`],
    ['vizzini', c => `Złodziej od ${c.d}? Ten amator? Ja bym go oszukał w trzy sekundy.`],
    ['rincewind', c => `Złodziej od ${c.d}. Mógłbym go polubić. W końcu też uciekam.`],
  ],
  mageCall: [
    ['gandalf', c => `Mag od ${c.d}. Tylko nie mówcie nikomu, że to mój stary uczeń.`],
    ['rincewind', c => `Mag od ${c.d}. Spokojnie, znam się na magii. Zwłaszcza na ucieczce przed nią.`],
    ['vizzini', c => `Mag od ${c.d}! Niemożliwe! Znowu ktoś, kto wie więcej ode mnie!`],
  ],
  dragonCall: [
    ['gandalf', c => `Smok od ${c.d}. Zawsze miałem do nich słabość. A raczej do ich skarbców.`],
    ['gimli', c => `Smok od ${c.d}! Wreszcie ktoś, kto zrozumie moją pasję do złota!`],
    ['legolas', c => `Smok od ${c.d}. Ewakuować wszystkich elfów. Znaczy: mnie.`],
    ['rincewind', c => `Smok od ${c.d}! Uciekam. Niech ktoś powie, że to taktyka.`],
  ],
  firstKill: [
    ['legolas', 'Jeden. Gimli, a ty nadal rozgrzewasz topór?'],
  ],
  killMilestone: [
    ['gimli', c => `Wrogów na koncie: ${c.k}! Legolasie, nie masz szans!`],
    ['legolas', c => `${c.k}. Gimli zaczął liczyć za późno.`],
    ['vizzini', c => `${c.k}! Dokładnie tak, jak przewidziałem. Przewidziałem wszystko.`],
  ],
  dragonDead: [
    ['gandalf', 'Smok padł. Nie wszystko złoto, co się świeci, ale jego skarbiec tak.'],
    ['gimli', 'Smok pokonany! Teraz złoto jest nasze. Całe. Co do monety.'],
    ['rincewind', 'Smok wyłączony z lotów! Ja nic nie zrobiłem. Chciałem tylko stać w pobliżu wyjścia.'],
  ],
  mageDead: [
    ['gandalf', 'Mag padł. Nigdy nie lekceważ tych, którzy dużo czytają.'],
    ['rincewind', 'Maga już nie ma. Spokojnie, to nie jest zaraźliwe. Chyba.'],
  ],
  thiefDead: [
    ['inigo', 'Złodziej unieszkodliwiony. Przynajmniej będzie co opowiadać przy kolacji.'],
    ['sam', 'Złoto odzyskane! Dobrze, że nie wziął mojego garnka.'],
  ],
  stolen: [
    ['vizzini', c => `Ukradł złoto?! Strata: ${c.g}! Niemożliwe! A ja tak go podziwiałem!`],
  ],
  escaped: [
    ['vizzini', c => `Uciekł ze złotem! Strata: ${c.g}. Niemożliwe! A ja go widziałem pierwszy!`],
    ['rincewind', c => `Uciekł ze złotem. Strata: ${c.g}. Szacunek. Technika bardzo podobna do mojej.`],
  ],
  noGold: [
    ['sam', 'Brak złota, panie. Mam jeszcze trochę ziemniaków.'],
    ['gimli', 'Brak złota?! To obraza dla każdego krasnoluda!'],
  ],
  noMana: [
    ['gandalf', 'Mana się skończyła. Nawet czarodzieje muszą czasem odpocząć i coś zjeść.'],
    ['rincewind', 'Brak many? Wspaniale. Teraz nikt nie oczekuje, że coś zrobię.'],
  ],
  repair: [
    ['gimli', 'Mur naprawiony! Krasnoludzka robota! Niezniszczalna, dopóki ktoś jej nie zniszczy.'],
    ['sam', 'Mur gotowy, panie. Zrobiłem go z tego, co było pod ręką: z kamieni i dobrych intencji.'],
    ['gandalf', 'Mur gotowy. Jest mocniejszy niż poprzedni. A poprzedni był mocniejszy, niż się wydawało.'],
  ],
  hpUp: [
    ['inigo', 'Jestem zdrowszy. Teraz mogę dłużej mówić, że to nic takiego.'],
    ['gimli', 'Krasnolud krzepki jak skała! A skała przy mnie wymięka!'],
  ],
  manaUp: [
    ['gandalf', 'Więcej many. Magii nigdy za wiele, ale lepiej nie przesadzać.'],
    ['rincewind', 'Więcej many? Teraz będę mógł uciec trochę dalej!'],
  ],
  heal: [
    ['sam', 'Uzdrowiony! To przez moją herbatę. I trochę przez magię.'],
    ['gandalf', 'Rany się goją. Dziwne, jak szybko to idzie, gdy ktoś ma dobry dzień.'],
  ],
  lowHp: [
    ['inigo', 'Masz krew na ubraniu. Jestem pewien, że to nie moja. Chyba.'],
  ],
  critHp: [
    ['sam', 'Panie, nie odchodź! Zrobiłem ci zupę!'],
    ['gandalf', 'Dziś nie odejdziesz. Dziś za to ktoś inny pójdzie na emeryturę. Mam plan.'],
  ],
  lowTower: [
    [['gimli', 'Wieża się sypie! Ja jej nie budowałem, ale to i tak obraza!'], ['gandalf', 'Naprawiajcie mur. Nie ma czasu na łzy.']],
    [['rincewind', 'Wieża się wali! To moja okazja do ucieczki!'], ['artur', 'Rincewind, stój!']],
  ],
  gameOverTower: [
    [['gandalf', 'Wieża padła. Wy nie przejdziecie... a, nie, jednak przeszli.'], ['rincewind', 'Uciekam!']],
  ],
  gameOverPlayer: [
  ],
  meteor: [
    ['gandalf', 'Meteory! Pamiętajcie: niebo nie spada, chyba że ja tak zdecyduję.'],
    ['rincewind', 'Meteory! Ukryjcie się za mną. Nie, w ogóle nie chowajcie się za mną.'],
  ],
  mortarClose: [
    ['gimli', 'Za blisko! Z moździerzem się nie żartuje. No dobra, żartuje się.'],
  ],
  voiceOn: [
    ['gandalf', 'Głosy wróciły. Czarodziej nigdy się nie spóźnia.'],
  ],
});
