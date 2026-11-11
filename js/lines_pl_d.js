// Kwestie PL, część D: nowi wrogowie (wargi, szamani, mroczne elfy, magowie, nekromanta, smoki) i ich efekty
addLines('pl', {
  wargCall: [
    ['gimli', c => `Ork na wargu od ${c.d}! Nikt nie rzuca krasnoludem. Ale warg chętnie rzuci mną.`],
    ['legolas', c => `Warg od ${c.d}. Wielki wilk, zły ork na grzbiecie. Strzelę w tego na górze, łatwiej trafić.`],
    ['gandalf', c => `Wargi od ${c.d}! Wiedziałem, że to nie zwykłe psy. Wszyscy mówili, że przesadzam. A ja miałem rację.`],
    ['sam', c => `Ork na wielkim wilku od ${c.d}, panie! Pieseczek? Nie? No dobrze, już nic nie mówię.`],
    ['rincewind', c => `Warg od ${c.d}! Wilki nie lubią, gdy się przed nimi ucieka. Ale i tak uciekam.`],
  ],
  shamanCall: [
    ['gandalf', c => `Szaman orków od ${c.d}. Zielona magia. Brzydka, ale skuteczna. Jak sami orkowie.`],
    ['tim', c => `Szaman od ${c.d}! Ten też ma rogi? Skąd oni to biorą?!`],
    ['robin', c => `Szaman od ${c.d} i jego zielone czary. Może po prostu się z nimi przywitajmy?`],
    ['gimli', c => `Szaman od ${c.d}! Teraz orkowie będą biegać szybciej. Te czary są zielone!`],
  ],
  elfarcherCall: [
    ['legolas', c => `Mroczny elf od ${c.d}. Ma łuk. Ma też fatalny gust. Jestem obrażony w imieniu wszystkich elfów.`],
    ['gimli', c => `Elf łucznik od ${c.d}! Piękny, dumny i pewnie pachnie lawendą. Poczekajcie, aż go trafię!`],
    ['robin', c => `Elf łucznik od ${c.d}! Ma lepsze włosy niż ja! Wyeliminujmy go natychmiast.`],
    ['inigo', c => `Mroczny elf od ${c.d}. Nazywam się Inigo Montoya. Nie lubię elfów, które strzelają z daleka.`],
  ],
  elfwitchCall: [
    ['gandalf', c => `Mroczna czarownica od ${c.d}. Jej klątwa wysysa manę. Trzymajcie ją z dala od mojej fajki.`],
    ['tim', c => `Elfka czarownica od ${c.d}! Drenuje manę? To moja robota, nie jej!`],
    ['rincewind', c => `Czarownica od ${c.d}. Wysysa magię. Ja mam jej tyle, co kot napłakał, więc jestem bezpieczny!`],
    ['legolas', c => `Mroczna czarownica od ${c.d}. Moja kuzynka. Daleka. Bardzo daleka. Mam nadzieję.`],
  ],
  pyroCall: [
    ['tim', c => `Piromanta od ${c.d}! Ogień! Patrzcie, jakie czary! Prawie jak moje!`],
    ['robin', c => `Mag ognia od ${c.d}. Kolejny powód, żeby stać z tyłu. Jest ciepło, ale nie aż tak.`],
    ['gandalf', c => `Piromanta od ${c.d}. Płomień Anoru mnie nie przeraża. Jego ogień trochę tak.`],
    ['patsy', c => `Mag ognia od ${c.d}, panie! Moje kokosy się upieką!`],
  ],
  frostCall: [
    ['sam', c => `Mag lodu od ${c.d}, panie. Zimno mi już teraz. A on dopiero się zbliża.`],
    ['gimli', c => `Mag mrozu od ${c.d}! Krasnoludy lubią chłód. To znaczy, w kuflu piwa.`],
    ['gandalf', c => `Mag lodu od ${c.d}. Pamiętam Caradhras. Ta góra też była wredna.`],
    ['robin', c => `Mag mrozu od ${c.d}! Spowalnia? Doskonale, i tak jestem najwolniejszy w bitwie. Znaczy, mądrze ostrożny.`],
    ['czarny', c => `Mag lodu od ${c.d}? Zamrozi mi kikuty. Jeszcze jedna rzecz, której nie poczuję.`],
  ],
  stormCall: [
    ['gandalf', c => `Mag burzy od ${c.d}. Uwaga na czerwone koło na ziemi. Tam uderzy piorun. Odsuńcie się!`],
    ['rincewind', c => `Mag burzy od ${c.d}! Piorun uderzy tam, gdzie jest znak. Dziwne, ja zawsze uciekam tam, gdzie znaku nie ma.`],
    ['tim', c => `Mag burzy od ${c.d}! Grzmoty i błyskawice! Dobrze, że mamy wieżę z piorunochronem. A nie, nie mamy.`],
  ],
  necroCall: [
    ['maynard', c => `Nekromanta od ${c.d}. Wzywa zmarłych. Panie, to chyba jest zabronione w Księdze Armaszeku.`],
    ['gandalf', c => `Nekromanta od ${c.d}. Nie lubię, gdy zmarli wracają bez zaproszenia. Zwłaszcza gobliny.`],
    ['dennis', c => `Nekromanta od ${c.d}! Ja jeszcze żyję! Jeszcze nie chcę do tej drużyny!`],
  ],
  icedragonCall: [
    ['gandalf', c => `Lodowy smok od ${c.d}. Wreszcie ktoś, kto ochłodzi atmosferę. Dosłownie.`],
    ['gimli', c => `Lodowy smok od ${c.d}! Złoto się zmrozi, ale nadal będzie moje!`],
    ['patsy', c => `Lodowy smok od ${c.d}, panie! Mam tylko kokosy. Zamarzną.`],
  ],
  poisondragonCall: [
    ['gandalf', c => `Jadowity smok od ${c.d}. Trujący oddech. Na szczęście mam fajkę, a ona wszystko oczyszcza.`],
    ['rincewind', c => `Smok jadu od ${c.d}! Zielony, trujący i wielki. Trzy powody, żeby uciekać.`],
    ['sam', c => `Smok trucizny od ${c.d}, panie. Nie wygląda na takiego, co lubi ziemniaki.`],
  ],
  elfDead: [
    ['gimli', "Elf padł! Zapiszcie to w kronikach. A potem zapomnijcie o całej reszcie!"],
    ['legolas', "Mroczny elf poległ. Wciąż był brzydszy ode mnie. Nawet leżąc."],
    ['robin', "Elf wyeliminowany! Mimo że ładnie wyglądał, to dobra robota."],
  ],
  necroSummon: [
    ['maynard', "Nekromanta wskrzesił gobliny! Panie, mamy problem z nowymi sąsiadami!"],
    ['dennis', "Wyszły z ziemi! Widzicie? Nawet zmarli mają lepszą pracę niż ja!"],
    ['gandalf', "Gobliny wstały z martwych. To nie powinno być możliwe. A jednak. Jak zwykle."],
  ],
  shamanBuff: [
    ['gimli', "Szaman zielonym czarem wzmocnił orków! Biegną szybciej i biją mocniej. Świetnie."],
    ['gandalf', "Zielona magia na orkach! Czasem lepiej nie wiedzieć, jak to działa."],
    ['patsy', "Orkowie świecą na zielono, panie! Mają teraz jeszcze więcej entuzjazmu!"],
    ['tim', "Wzmocnił ich! To oszustwo. Ja tak nie robię. Prawie nigdy."],
  ],
  dragonBreath: [
    ['artur', "Smok nabiera powietrza! Pod osłonę!"],
    ['robin', "Smok się nadyma! Zmieniam plan na ucieczkę!"],
    ['gandalf', "Uwaga na oddech smoka! Schowajcie się za czymkolwiek!"],
    ['rincewind', "Smok nabiera powietrza! To nie jest dobry znak! Nigdy nie jest!"],
  ],
  slowed: [
    ['robin', "Jestem spowolniony! Uciekam tak samo jak zawsze, tylko wolniej!"],
    ['gimli', "Zamarzam! I to bez piwa!"],
    ['sam', "Panie, nie czuję palców u stóp. A miałem ich dwanaście. Dziesięć."],
    ['czarny', "Jestem zamrożony? To tylko draśnięcie."],
    ['tim', "Ruszam się jak ślimak! Ale czaruję jak szybki ślimak!"],
  ],
  poisoned: [
    ['robin', "Zatruty! Wiedziałem, że nie powinienem pić z tego kielicha!"],
    ['gimli', "Trucizna! Krasnoludy są odporne. Prawie. Trochę. Cofam to."],
    ['maynard', "Zatruty! Panie, wyleczysz mnie? Panie? Halo?"],
  ],
  burning: [
    ['robin', "Płonę! Płonę! Czy ktoś ma wiadro? Albo dwa?"],
    ['gandalf', "Ogień! Zwykle to ja go rzucam. Dziwne uczucie."],
    ['sam', "Palę się, panie! Ale przynajmniej ziemniaki będą ciepłe!"],
    ['patsy', "Pali się, panie! Kokosy się upieką!"],
    ['rincewind', "Pożar! Uciekam! Wiem, że to nie pomaga! Ale to lubię!"],
  ],
  cursed: [
    ['tim', "Moja mana! Zabrała mi manę! Jak teraz zaczaruję?"],
    ['gandalf', "Klątwa mrocznej elfki! Poczułem, jak magia ze mnie ucieka. Jakbym zapomniał własnego imienia."],
    ['rincewind', "Mana wyssana! Dobrze, że i tak jej nie miałem."],
    ['legolas', "Klątwa wyssała ze mnie siły! Nawet moje włosy straciły blask."],
  ],
  orkCall2: [
    ['robin', c => `Orkowie od ${c.d}! Pachną jak stajnia po deszczu. Ale to nie ja, przysięgam.`],
    ['artur', c => `Orkowie od ${c.d}! Niech nikt nie pokazuje im tarczy. Są wrażliwi.`],
    ['gimli', c => `Orkowie od ${c.d}! Podobno jest ich tylu, że liczyłbym ich do wieczora.`],
    ['gandalf', c => `Orkowie od ${c.d}. Stara, dobra klasyka. Jak ten kapelusz.`],
  ],
});
