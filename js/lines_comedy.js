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
    ['artur', 'Nazywam się Artur. Król Artur. Zamiast martini poproszę wiadro piwa, zamiast pistoletu miecz, a zamiast licencji na dreszcze koronę.'],
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
    ['vizzini', 'Brak złota? Mogę sprzedać wam bardzo dobry miecz. Jeden poprzedni właściciel. Wyprowadził się, ale nie z mojej winy.'],
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
    ['artur', 'The name is Arthur. King Arthur. A pail of ale instead of a martini, a sword instead of a pistol, and a crown instead of a licence to thrill.'],
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
    ['vizzini', 'No gold? I can sell you an excellent sword. One previous owner. He moved out, but not because of anything I did.'],
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

// Passing scenery (see ambient.js): the crew comments on what flies, sails or runs by.
addLines('pl', {
  amb_delorean: [
    [['robin', 'Czy ktoś jeszcze widział srebrną karocę z ogniem w kołach? Nie? To znaczy, że mi się wydawało. Doskonale.'], ['rincewind', 'Mnie też. Pędziła osiemdziesiąt osiem mil na godzinę i znikła. Znam to uczucie.']],
    [['gandalf', 'Przeszła przez czas jak przez masło. Doc by się ucieszył. Nie pytaj, kto to jest Doc.'], ['patsy', 'Skoro nie mam pytać, to dlaczego mi pan o tym mówi?']],
    [['artur', 'Na Świętego Graala, ale to szybkie!'], ['lancelot', 'Koni nie potrzeba, drogi ani czasu. Kowal, zamów nam taką karocę!']],
  ],
  amb_witch: [
    [['gandalf', 'Wiedźma na miotle. Uprzejmie proszę o nieprzelatywanie nad moją wieżą bez zezwolenia.'], ['tim', 'Ja mam z nią rachunki! Pożyczyła ode mnie kapelusz i nie oddała.']],
    [['dennis', 'Patrzcie, wiedźma! Jest na miotle!'], ['galahad', 'Czy pali się z jej powodu coś drewnianego? Bo jeśli jest z drewna, to jest wiedźmą.']],
    [['rincewind', 'Jeżdżenie na miotle to ogromne ryzyko. Ja próbowałem raz. Zahaczyłem o chmurę.'], ['robin', 'A ja się dzielnie schowałem. Na wszelki wypadek, w beczce.']],
  ],
  amb_et: [
    [['rincewind', 'Patrzcie! Coś małego jedzie rowerem po niebie, a w koszyku ma światło!'], ['gandalf', 'Prawdziwe czary. Pewnie chce zadzwonić do domu.']],
    [['sam', 'Proszę pana, chyba zaraz przeleci obok księżyca. Z rowerem.'], ['artur', 'Dobry znak. Nikt nie wie, czemu, ale dobry.']],
    [['patsy', 'Pan widział? Mały brzydal na rowerze, a palec mu świeci.'], ['dennis', 'Wspaniale. A mnie ciągle mówią, że w tym kraju nic nie lata. Ciemiężą lud!']],
  ],
  amb_starlink: [
    [['gandalf', 'Sznur światełek na niebie, równo jak na sznurku. To nie czary. To gorsze: to rozkład jazdy.'], ['sam', 'A po co tyle? Żeby wszyscy mieli bezprzewodową wieść?']],
    [['tim', 'Dwadzieścia kilka gwiazd w rzędzie! Czy ktoś je pilnuje, czy uciekły?'], ['robin', 'Ja się zgubiłem rano i nikt nie robił sznura.']],
    [['rincewind', 'To nie gwiazdy. Gwiazdy nie jeżdżą w kolumnie. Za to czarodzieje czasem tak.'], ['galahad', 'Czysta kolumna. Podziwiam porządek.']],
  ],
  amb_trex: [
    [['patsy', 'Panie! Daleko, za polami! Biegnie jaszczur wielki jak dom!'], ['artur', 'Nie wiem, co to jest, ale to nasz problem dopiero, jak skręci tutaj.']],
    [['gimli', 'Mój kuzyn miał takiego psa. Nigdy go potem nie znaleziono.'], ['legolas', 'Biegnie z wdziękiem. Szkoda, że pachnie jak stajnia.']],
    [['lancelot', 'Gad! Ogromny gad! Do broni!'], ['czarny', 'Spokojnie. To tylko draśnięcie. Zwykle mówię to ja.']],
  ],
  amb_dutchman: [
    [['robin', 'Statek na niebie! Ze świecącymi żaglami i zieloną mgłą! Jak sądzicie, ma wolne miejsca dla tchórza?'], ['gandalf', 'To zjawa. Piraci, którzy nie dopłynęli do portu. Nie dla ciebie, Robinie.']],
    [['rincewind', 'Statek duchów płynie po chmurach. Zawsze powtarzałem, że morze nie ma sensu, a teraz widzę, że niebo też nie.'], ['sam', 'Chyba nie chcę wiedzieć, kto jest kapitanem, proszę pana.']],
    [['dennis', 'Patrzcie, łódź na niebie! Pływa w powietrzu!'], ['artur', 'To nie łódź, Dennisie. To galeon. Taki większy.']],
  ],
  amb_rohan: [
    [['legolas', 'Jeźdźcy na horyzoncie! Zielony sztandar, dwadzieścia koni i ani jednego pomysłu, kto im płaci.'], ['gimli', 'Nikt im nie płaci. Jadą z honoru. Co za marnotrawstwo.']],
    [['gandalf', 'Spójrzcie na wschód. O świcie piątego dnia przybędzie pomoc. Tym razem to nie ja robię całą robotę.'], ['robin', 'To i tak najlepszy plan. Mój plan to właśnie ten.']],
    [['artur', 'Zaprawdę! Konnica, która nigdy nie była w Camelocie. Pewnie ma tam zły adres.'], ['lancelot', 'Prawdziwe konie, w pełnym galopie. Zazdroszczę i pytam, kto je karmi.']],
  ],
  amb_coconut: [
    [['patsy', 'Panie! Ktoś idzie po polu i stuka kokosami. Kto jedzie bez konia?'], ['artur', 'Dziwne. Ten w koronie ma bardzo podobny chód do mojego. Ale ja tu stoję.']],
    [['czarny', 'Dwóch jegomościów galopuje bez koni i stuka kokosami. Brzmi znajomo, ale nie pamiętam skąd.'], ['galahad', 'Ja nie pamiętam, a przecież jestem czysty.']],
    [['robin', 'Dwóch dzielnych rycerzy dla odmiany bez wierzchowców! Nareszcie ktoś mi dorównuje. Znaczy, ja dorównuję im.'], ['tim', 'Kokosy nie przylatują z południa. Ktoś tu coś ukrywa.']],
  ],
});
addLines('en', {
  amb_delorean: [
    [['robin', 'Did anyone else see a silver carriage with fire in its wheels? No? Then I imagined it. Splendid.'], ['rincewind', 'I saw it too. Eighty-eight miles an hour, then gone. I know the feeling.']],
    [['gandalf', 'It went through time like a knife through butter. Doc would be thrilled. Do not ask who Doc is.'], ['patsy', 'If I am not to ask, sir, why are you telling me?']],
    [['artur', 'Great Scott, that is fast!'], ['lancelot', 'No horses, no roads, no time. Blacksmith, order us one of those!']],
  ],
  amb_witch: [
    [['gandalf', 'A witch on a broom. I politely request that she not fly over my tower without a permit.'], ['tim', 'I have a bone to pick with her. She borrowed my hat and never gave it back.']],
    [['dennis', 'Look, a witch! She is on a broom!'], ['galahad', 'Is anything wooden on fire because of her? Because if she is made of wood, she is a witch.']],
    [['rincewind', 'Flying on a broom is a terrible risk. I tried it once. I hit a cloud.'], ['robin', 'And I bravely hid, so there would be no complaints.']],
  ],
  amb_et: [
    [['rincewind', 'Look! Something small is cycling across the sky with a light in its basket!'], ['gandalf', 'Real magic. I expect it wants to phone home.']],
    [['sam', 'Mr. Frodo would say it is about to pass in front of the moon. On a bicycle.'], ['artur', 'A good omen. Nobody knows why, but a good one.']],
    [['patsy', 'Did you see, sir? A little ugly fellow on a bicycle, and his finger glows.'], ['dennis', 'Wonderful. So that is what they mean by repressive government.']],
  ],
  amb_starlink: [
    [['gandalf', 'A string of lights in the sky, straight as a ruler. That is not magic. It is worse: it is a timetable.'], ['sam', 'What is it for, sir? So everyone can get the news without a wire?']],
    [['tim', 'Twenty-odd stars in a row! Is anyone minding them, or are they lost?'], ['robin', 'I got lost this morning and nobody made a string of lights for me.']],
    [['rincewind', 'Those are not stars. Stars do not travel in convoy. Wizards sometimes do.'], ['galahad', 'A pure column. I admire the discipline.']],
  ],
  amb_trex: [
    [['patsy', 'Sir! Far off beyond the fields, a lizard the size of a house is running!'], ['artur', 'I do not know what it is, but it only becomes our problem if it turns this way.']],
    [['gimli', 'My cousin had a dog like that. He was never seen again.'], ['legolas', 'It runs with grace. A pity it smells like a stable.']],
    [['lancelot', 'A beast! A giant beast! To arms!'], ['czarny', 'Calm down. It is only a scratch. Usually I am the one who says that.']],
  ],
  amb_dutchman: [
    [['robin', 'A ship in the sky! With glowing sails and green mist! Do you think they have a berth for a coward?'], ['gandalf', 'That is a wraith ship. Sailors who never reached port. Not for you, Robin.']],
    [['rincewind', 'A ghost ship sailing through the clouds. I always said the sea made no sense, and now I see the sky does not either.'], ['sam', 'I do not think I want to know who the captain is, sir.']],
    [['dennis', 'Look, a boat in the sky! It floats on air!'], ['artur', 'That is not a boat, Dennis. It is a galleon. The larger kind.']],
  ],
  amb_rohan: [
    [['legolas', 'Riders on the horizon! A green banner, twenty horses, and not a clue who is paying them.'], ['gimli', 'Nobody is paying them. They ride for honour. What a waste.']],
    [['gandalf', 'Look to the east. At dawn on the fifth day, help arrives. For once I am not doing all the work.'], ['robin', 'It is still the best plan. It is, in fact, mine.']],
    [['artur', 'Verily! A cavalry that has never visited Camelot. They must have the wrong address.'], ['lancelot', 'The horses are real. And at a gallop. I am jealous, and I wonder who feeds them.']],
  ],
  amb_coconut: [
    [['patsy', 'Sir! Someone is walking across the field clapping coconuts. Who rides without a horse?'], ['artur', 'Strange. The one in the crown walks very much like me. But I am standing right here.']],
    [['czarny', 'Two gentlemen are galloping without a horse and clapping coconuts. That sounds familiar, but I cannot think where from.'], ['galahad', 'Neither can I, and I am the pure one.']],
    [['robin', 'Two brave knights, for once without mounts! At last somebody matches me. I mean, I match them.'], ['tim', 'Coconuts do not migrate from the south. Someone is hiding something here.']],
  ],
});
