// Action-movie parodies (Die Hard, Terminator, Matrix, Predator, Top Gun, Aliens, Jaws, 300, Mission: Impossible, Bond...),
// spoken by the existing crew. They are added to the existing pools.
addLines('pl', {
  waveStart: [
    ['lancelot', c => `Fala ${c.o}. Jipi-ka-jej, panowie!`],
    ['gimli', c => `Fala ${c.o}. Przyszedłem tu kopać orków i żuć gumę. A gumy mi zabrakło.`],
    ['robin', c => `Fala ${c.o}. Wspaniały dzień na bohaterstwo! Ty pierwszy, nalegam.`],
    ['dennis', c => `Fala ${c.o}. Wrócę. Chyba że najpierw mnie uciskają.`],
    ['tim', c => `Fala ${c.o}. Nie ma łyżki. Nie ma też muru. Planu też nie ma.`],
  ],
  waveClear: [
    ['artur', c => `Fala ${c.o} odparta. Dziś świętujemy dzień, w którym nie daliśmy się zjeść!`],
    ['gimli', c => `Fala ${c.o} za nami. Kocham, kiedy plan się udaje. Zwłaszcza że to zawsze ten sam plan: uderzyć orka.`],
  ],
  killMilestone: [
    ['lancelot', c => `Wrogów na koncie: ${c.k}. Dobrze się bawicie? Po to tu przyszliście?!`],
    ['robin', c => `Wrogów na koncie: ${c.k}. Houston, mamy problem: nikt nie powiedział orkom, że przegrywają.`],
  ],
  firstKill: [
    ['galahad', 'Pierwszy. Hasta la vista, wrogu. Tak mówi się w czystych kręgach.'],
  ],
  dragonCall: [
    ['robin', c => `Smok od ${c.d}! Potrzebujemy większej wieży. Albo mniejszego smoka.`],
    ['lancelot', c => `Smok od ${c.d}! Biegiem do helikoptera! Chwila. My nie mamy helikoptera. Biegiem do wieży!`],
  ],
  dragonDead: [
    ['gandalf', 'Smok padł. Jestem za stary na takie rzeczy.'],
  ],
  lowHp: [
    ['tim', 'Czerwona pigułka czy niebieska? Poproszę trzecią, tę, która leczy.'],
  ],
  heal: [
    ['dennis', 'Czuję się świetnie! Gdzie jest to potłuczone szkło? Chcę po nim chodzić boso!'],
  ],
  helperDead: [
    ['lancelot', 'Goose! Nieee! To znaczy: pomocniku. Nie poznałem twojego imienia.'],
  ],
  lowTower: [
    ['robin', 'Koniec gry, człowieku! Koniec gry! Wieża się wali!'],
  ],
  meteor: [
    ['lancelot', 'Uwielbiam zapach meteorów o poranku. Pachną zwycięstwem.'],
  ],
  weapon2: [
    ['inigo', 'Kusza. Tak, wygląda na to, że wróciłem.'],
  ],
  weapon3: [
    ['gimli', 'Moździerz! To jest Sparta! Znaczy wieża. Ale z tą samą energią.'],
  ],
  weapon5: [
    ['tim', 'Błyskawica. Znam kung-fu. Znaczy: magię. Prawie to samo.'],
  ],
  battle: [
    ['lancelot', 'Jipi-ka-jej, orkowie!'],
    ['robin', 'Mam złe przeczucia co do tej fali. Mam je zresztą co do każdej.'],
  ],
  chat: [
    [['artur', 'Twoja misja, jeśli ją przyjmiesz: obronić wieżę. Ta wiadomość samozniszczy się za pięć sekund.'], ['patsy', 'Panie, a jeśli się nie zniszczy?'], ['artur', 'To znaczy, że jest z kokosa.']],
    [['gandalf', 'Dla mnie piwo. Wstrząśnięte, nie mieszane.'], ['gimli', 'Wstrząśnięte piwo? To herezja!'], ['gandalf', 'Ale elegancka.']],
    [['dennis', 'Wrócę.'], ['artur', 'Dokąd idziesz?'], ['dennis', 'Nigdzie. Zawsze chciałem to powiedzieć.']],
    [['tim', 'Nie ma łyżki.'], ['patsy', 'Jest, panie. Mam ją tu, do owsianki.'], ['tim', 'Zepsułeś mi scenę.']],
    [['gimli', 'Jeśli krwawi, możemy to pokonać.'], ['lancelot', 'A jeśli nie krwawi?'], ['gimli', 'To uderzymy mocniej.']],
    [['lancelot', 'Czuję potrzebę prędkości!'], ['robin', 'Uciekać? Mogę nauczyć. Jestem bardzo szybki.']],
  ],
});
addLines('en', {
  waveStart: [
    ['lancelot', c => `Wave ${c.o}. Yippee-ki-yay, gentlemen!`],
    ['gimli', c => `Wave ${c.o}. I came here to kick orcs and chew bubblegum. And I am all out of bubblegum.`],
    ['robin', c => `Wave ${c.o}. A lovely day to be a hero! You first, I insist.`],
    ['dennis', c => `Wave ${c.o}. I'll be back. Unless the system oppresses me first.`],
    ['tim', c => `Wave ${c.o}. There is no spoon. Also no wall. Also no plan.`],
  ],
  waveClear: [
    ['artur', c => `Wave ${c.o} repelled. Today we celebrate our independence day! From being eaten.`],
    ['gimli', c => `Wave ${c.o} done. I love it when a plan comes together. Mostly because it is always the same plan: hit the orc.`],
  ],
  killMilestone: [
    ['lancelot', c => `${c.k} down! Are you not entertained? Is this not why you came here?`],
    ['robin', c => `${c.k} on the tally. Houston, we have a problem: nobody told the orcs they are losing.`],
  ],
  firstKill: [
    ['galahad', 'One down. Hasta la vista, enemy. That is what they say in the pure circles.'],
  ],
  dragonCall: [
    ['robin', c => `Dragon from the ${c.d}! We are going to need a bigger tower. Or a smaller dragon.`],
    ['lancelot', c => `Dragon from the ${c.d}! Get to the chopper! Wait. We do not have a chopper. Get to the tower!`],
  ],
  dragonDead: [
    ['gandalf', 'The dragon is down. I am too old for this.'],
  ],
  lowHp: [
    ['tim', 'Red pill or blue pill? I will take the third one, the one that heals.'],
  ],
  heal: [
    ['dennis', 'I feel great! Where is the broken glass? I want to walk on it barefoot!'],
  ],
  helperDead: [
    ['lancelot', 'Goose! Noooo! I mean, helper. I never learned your name.'],
  ],
  lowTower: [
    ['robin', 'Game over, man! Game over! The tower is going down!'],
  ],
  meteor: [
    ['lancelot', 'I love the smell of meteors in the morning. Smells like victory.'],
  ],
  weapon2: [
    ['inigo', 'Crossbow. Yeah, I am thinking I am back.'],
  ],
  weapon3: [
    ['gimli', 'Mortar! This is Sparta! Well, a tower. Same energy.'],
  ],
  weapon5: [
    ['tim', 'Lightning. I know kung fu. I mean magic. Close enough.'],
  ],
  battle: [
    ['lancelot', 'Yippee-ki-yay, orcs!'],
    ['robin', 'I have a bad feeling about this wave. I have it about every wave, actually.'],
  ],
  chat: [
    [['artur', 'Your mission, should you choose to accept it, is to defend this tower. This message will self-destruct in five seconds.'], ['patsy', 'Sire, what if it does not?'], ['artur', 'Then it is made of coconut.']],
    [['gandalf', 'A pint for me. Shaken, not stirred.'], ['gimli', 'Shaken ale? That is heresy!'], ['gandalf', 'An elegant heresy.']],
    [['dennis', "I'll be back."], ['artur', 'Where are you going?'], ['dennis', 'Nowhere. I just always wanted to say it.']],
    [['tim', 'There is no spoon.'], ['patsy', 'There is, sire. I have it here for the porridge.'], ['tim', 'You ruined my scene.']],
    [['gimli', 'If it bleeds, we can beat it.'], ['lancelot', 'And if it does not bleed?'], ['gimli', 'Then we hit it harder.']],
    [['lancelot', 'I feel the need, the need for speed!'], ['robin', 'Running away? I can teach you. I am very fast.']],
  ],
});
