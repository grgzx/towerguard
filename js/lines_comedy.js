// Comedy parodies: Beverly Hills Cop, Police Academy, The Secret of Monkey Island, plus "swap the prop" fusions
// (a famous line with a medieval object instead of the original one). Spoken by the existing crew, added to existing pools.
addLines('pl', {
  orkTaunt: [
    [['ork', 'Walczysz jak pasterz!'], ['dennis', 'Dziękuję. A ty walczysz jak owca.']],
    [['ork', 'Znałem goblinów milszych od ciebie!'], ['czarny', 'Wspaniale. Jak tam zjazd rodzinny?']],
    [['ork', 'Mój miecz zamieni twoją głowę w kufel!'], ['gimli', 'Proszę bardzo. Pod warunkiem że wlejesz piwo.']],
  ],
  goblinTaunt: [
    [['goblin', 'Spójrzcie za siebie! Trójgłowa małpa!'], ['robin', 'Gdzie?!'], ['goblin', 'Ha! Prymitywne, ale działa.']],
    [['goblin', 'Jesteśmy groźni! Mamy gumowego kurczaka z bloczkiem pośrodku!'], ['patsy', 'My też. Jest nam bardzo przykro.']],
  ],
  start: [
    ['robin', 'Nazywam się Robin Mężny-Inaczej i jestem potężnym piratem. Znaczy rycerzem. Znaczy, idę po zapasy.'],
    ['artur', 'Nazywam się Artur. Król Artur. Zamiast martini poproszę wiadro piwa, zamiast pistoletu miecz, a zamiast licencji na zabijanie koronę.'],
    ['lancelot', 'Rekruci! Zasady akademii obrońców wieży są trzy: nie dać się zjeść, nie dać się zjeść i nie dać się zjeść.'],
  ],
  waveStart: [
    ['lancelot', c => `Fala ${c.o}. Jestem z Detroit. Znaczy z Camelotu. Ale miałem tę samą wypłatę.`],
    ['patsy', c => `Fala ${c.o}. Wrrum, bum bum, pif-paf! To nie machina, panie. To ja.`],
  ],
  waveClear: [
    ['gimli', c => `Fala ${c.o} odparta. Pora na grog. Grog rozpuścił mi już dwa kufle, ale to znak jakości.`],
    ['gandalf', c => `Fala ${c.o} za nami. Dla mnie piwo. Ciemne, bez piany, bez mieszania i bez pytań.`],
  ],
  noGold: [
    ['patsy', 'Skarbiec pusty, panie. Zostały kokosy i gumowy kurczak z bloczkiem w środku. Ten kurczak jeszcze się przyda.'],
    ['vizzini', 'Brak złota? Mogę sprzedać wam bardzo dobry miecz. Jeden poprzedni właściciel. Zmarł, ale nie z mojej winy.'],
  ],
  repair: [
    ['gimli', 'Mur gotowy. Gdyby ktoś pytał: piwo piłem wyłącznie na budowie. Czyli cały czas.'],
  ],
  thiefCall: [
    ['lancelot', 'Złodziej! Policja Camelotu! Stój! Mam odznakę! To skorupa kokosa, ale z daleka wygląda poważnie.'],
  ],
  dragonCall: [
    ['lancelot', c => `Smok od ${c.d}! Powiedzcie mu, że jest aresztowany. Zawsze działa, jeśli smok nie wie, co to areszt.`],
    ['robin', c => `Smok od ${c.d}! W Beverly Hills wystarczy banan w rurze wydechowej. Smok ma sporo rur. Ktoś ma banana?`],
  ],
  firstKill: [
    ['robin', 'Pierwszy! W kronikach zapiszą mnie jako pirata. Znaczy dzielnego wojownika. Znaczy świadka.'],
  ],
  heal: [
    ['maynard', 'Uzdrowienie! Czuję się jak po grogu: nie wiem, kto jestem, ale jestem pełen życia.'],
  ],
  weapon7: [
    ['gimli', 'Balista! Zawsze chciałem mieć coś, co strzela większymi rzeczami niż ja sam. Piwo też jest większe od krasnoluda.'],
  ],
  gameOverPlayer: [
    ['artur', 'Obrońca padł. Zaliczamy to jako ćwiczenia akademii. Wszyscy wracamy do domu, a komendant stawia piwo.'],
  ],
  battle: [
    ['galahad', 'Zasada akademii numer jeden: nie biegać z mieczem. Numer dwa: biegać z toporem. Numer trzy: zapomnieć o zasadach.'],
  ],
  chat: [
    [['lancelot', 'Mam odznakę. Pokazuję ją każdemu orkowi pod nosem.'], ['patsy', 'To skorupa kokosa, panie.'], ['lancelot', 'Działa tak samo.']],
    [['robin', 'Wsadźcie smokowi banana do nozdrza. W Beverly Hills to działa na samochody.'], ['gandalf', 'Smok nie jest samochodem.'], ['robin', 'Smok też nie ma rejestracji, czyli coś ich łączy.']],
    [['patsy', 'Wrrrum, tra-ta-ta, bum! Zrobiłem dźwięk machiny oblężniczej.'], ['artur', 'To byłeś ty, Patsy?'], ['patsy', 'Tak, panie. Ludzie mówią, że mam talent.']],
    [['gimli', 'Mam siedem toporów, osiem młotów i dziewięć noży.'], ['galahad', 'Po co aż tyle?'], ['gimli', 'Bo dziesiąty topór byłby nierozsądny.']],
    [['artur', 'Witajcie, kadeci, w akademii obrońców wieży. Zaczniemy od przemówienia.'], ['czarny', 'Mównica się przewróciła, panie.'], ['artur', 'To tylko draśnięcie. Mówię dalej.']],
    [['gimli', 'Znalazłem gospodę „Pod Błękitną Ostrygą”. Piwo wyśmienite, goście w skórach.'], ['galahad', 'Czysto tam?'], ['gimli', 'Bardzo. I wszyscy mają wąsy.']],
    [['robin', 'Pamiętajcie: miecz w prawej ręce, grog w lewej.'], ['gimli', 'Grog rozpuszcza kufle.'], ['robin', 'To dodaje do walki elementu zaskoczenia.']],
    [['tim', 'Zamiast czerwonej i niebieskiej pigułki biorę kufel. Wolę, żeby rzeczywistość była lekko rozmyta.'], ['patsy', 'Kufel jest pusty, panie.'], ['tim', 'No właśnie. Tak wygląda prawdziwa rzeczywistość.']],
  ],
});
addLines('en', {
  orkTaunt: [
    [['ork', 'You fight like a shepherd!'], ['dennis', 'Thank you. You fight like the sheep.']],
    [['ork', 'I have met goblins more polite than you!'], ['czarny', 'Wonderful. How was the family reunion?']],
    [['ork', 'My sword will turn your head into a tankard!'], ['gimli', 'Go ahead. As long as you fill it with ale.']],
  ],
  goblinTaunt: [
    [['goblin', 'Look behind you! A three-headed monkey!'], ['robin', 'Where?!'], ['goblin', 'Ha! Primitive, but it works.']],
    [['goblin', 'We are dangerous! We have a rubber chicken with a pulley in the middle!'], ['patsy', 'So do we. We are very sorry.']],
  ],
  start: [
    ['robin', 'My name is Robin the Brave-ish and I am a mighty pirate. I mean a knight. I mean, I am going to fetch supplies.'],
    ['artur', 'The name is Arthur. King Arthur. A pail of ale instead of a martini, a sword instead of a pistol, and a crown instead of a licence to kill.'],
    ['lancelot', 'Recruits! The rules of the Tower Defence Academy are three: do not get eaten, do not get eaten, and do not get eaten.'],
  ],
  waveStart: [
    ['lancelot', c => `Wave ${c.o}. I am from Detroit. I mean Camelot. But I got the same pay.`],
    ['patsy', c => `Wave ${c.o}. Vroom, boom boom, pew pew! That was not a siege engine, sire. That was me.`],
  ],
  waveClear: [
    ['gimli', c => `Wave ${c.o} repelled. Time for grog. It has dissolved two of my tankards already, but that is a mark of quality.`],
    ['gandalf', c => `Wave ${c.o} done. A pint for me. Dark, no foam, no stirring and no questions.`],
  ],
  noGold: [
    ['patsy', 'The treasury is empty, sire. We have coconuts and a rubber chicken with a pulley in the middle. That chicken will come in handy.'],
    ['vizzini', 'No gold? I can sell you an excellent sword. One previous owner. He died, but not of anything I did.'],
  ],
  repair: [
    ['gimli', 'The wall is ready. If anyone asks, I only drank on the building site. Which is all the time.'],
  ],
  thiefCall: [
    ['lancelot', 'Thief! Camelot Police! Freeze! I have a badge! It is half a coconut, but from a distance it looks serious.'],
  ],
  dragonCall: [
    ['lancelot', c => `Dragon from the ${c.d}! Tell him he is under arrest. It always works if the dragon does not know what arrest means.`],
    ['robin', c => `Dragon from the ${c.d}! In Beverly Hills a banana in the tailpipe is enough. A dragon has plenty of pipes. Anyone got a banana?`],
  ],
  firstKill: [
    ['robin', 'First one! The chronicles will list me as a pirate. I mean a brave warrior. I mean a witness.'],
  ],
  heal: [
    ['maynard', 'Healing! I feel as if I had drunk grog: I do not know who I am, but I am full of life.'],
  ],
  weapon7: [
    ['gimli', 'Ballista! I always wanted something that shoots things bigger than I am. Ale is also bigger than a dwarf.'],
  ],
  gameOverPlayer: [
    ['artur', 'The defender has fallen. We shall count it as an academy exercise. Everyone goes home, and the commandant buys the ale.'],
  ],
  battle: [
    ['galahad', 'Academy rule number one: do not run with a sword. Number two: run with an axe. Number three: forget the rules.'],
  ],
  chat: [
    [['lancelot', 'I have a badge. I show it to every orc under the nose.'], ['patsy', 'It is a coconut shell, sire.'], ['lancelot', 'Works the same.']],
    [['robin', 'Put a banana in the dragon\'s nostril. In Beverly Hills it works on cars.'], ['gandalf', 'A dragon is not a car.'], ['robin', 'It does not have a number plate either, so they have something in common.']],
    [['patsy', 'Vrrroom, rat-a-tat, boom! I made the sound of a siege engine.'], ['artur', 'That was you, Patsy?'], ['patsy', 'Yes, sire. People say I have a talent.']],
    [['gimli', 'I have seven axes, eight hammers and nine knives.'], ['galahad', 'Why so many?'], ['gimli', 'Because a tenth axe would be unreasonable.']],
    [['artur', 'Welcome, cadets, to the Tower Defence Academy. We begin with a speech.'], ['czarny', 'The lectern has fallen over, sire.'], ['artur', 'It is but a scratch. I will go on.']],
    [['gimli', 'I found a tavern called the Blue Oyster. Excellent ale, patrons in leather.'], ['galahad', 'Is it clean?'], ['gimli', 'Very. And everyone has a moustache.']],
    [['robin', 'Remember: sword in the right hand, grog in the left.'], ['gimli', 'Grog dissolves tankards.'], ['robin', 'It adds an element of surprise to a fight.']],
    [['tim', 'Instead of the red and the blue pill, I take a tankard. I prefer reality slightly blurry.'], ['patsy', 'The tankard is empty, sire.'], ['tim', 'Exactly. That is what real reality looks like.']],
  ],
});
