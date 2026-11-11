// English lines, part D: new enemies (wargs, shamans, dark elves, mages, necromancer, dragons) and their effects
addLines('en', {
  wargCall: [
    ['gimli', c => `Orc on a warg from the ${c.d}! Nobody tosses a dwarf. But a warg might toss me.`],
    ['legolas', c => `Warg rider from the ${c.d}. Big wolf, angry orc on top. I will shoot the one on top. Fewer fleas.`],
    ['gandalf', c => `Wargs from the ${c.d}! I knew those were not ordinary dogs. Nobody listens to the wizard.`],
    ['sam', c => `Orc on a great wolf from the ${c.d}, Mr. Frodo! Nice doggy? No? Right. Quiet now.`],
    ['rincewind', c => `Warg from the ${c.d}! Wolves love a good chase. Sadly, I am very good at being chased.`],
  ],
  shamanCall: [
    ['gandalf', c => `Orc shaman from the ${c.d}. Green magic. Ugly but effective. Like orcs.`],
    ['tim', c => `Shaman from the ${c.d}! Does he have horns too? Where do they all get them?!`],
    ['robin', c => `Shaman from the ${c.d} with his green spells. Sire, could we just say hello first?`],
    ['gimli', c => `Shaman from the ${c.d}! He will make the orcs faster and angrier. Mostly angrier.`],
  ],
  elfarcherCall: [
    ['legolas', c => `Dark elf from the ${c.d}. He has a bow and terrible taste. I am offended on behalf of all elves.`],
    ['gimli', c => `Elf archer from the ${c.d}! Pretty, proud and probably smells of lavender. Wait until I get my axe on him!`],
    ['robin', c => `Elf archer from the ${c.d}! His hair is better than mine! See him off at once.`],
    ['inigo', c => `Dark elf from the ${c.d}. An archer. I prefer enemies who stand close enough to introduce themselves.`],
  ],
  elfwitchCall: [
    ['gandalf', c => `Dark witch from the ${c.d}. Her curse drains mana. Keep her away from my pipe.`],
    ['tim', c => `Elf witch from the ${c.d}! She drains mana? That is my job, not hers!`],
    ['rincewind', c => `Witch from the ${c.d}. She drains magic. I have none, so I am perfectly safe!`],
    ['legolas', c => `Dark witch from the ${c.d}. A cousin of mine. A distant one. A very distant one. I hope.`],
  ],
  pyroCall: [
    ['tim', c => `Pyromancer from the ${c.d}! Fire! Behold the sorcery! Almost as good as mine!`],
    ['robin', c => `Fire mage from the ${c.d}. One more reason to stand at the back. It is warm there, but not that warm.`],
    ['gandalf', c => `Pyromancer from the ${c.d}. I fought a Balrog. His flames are somewhat smaller. Somewhat.`],
    ['patsy', c => `Fire mage from the ${c.d}, sire! My coconuts will get roasted!`],
  ],
  frostCall: [
    ['sam', c => `Frost mage from the ${c.d}, Mr. Frodo. I am cold already. And he is only getting closer.`],
    ['gimli', c => `Frost mage from the ${c.d}! Dwarves like the cold. In a mug of ale, I mean.`],
    ['gandalf', c => `Frost mage from the ${c.d}. I remember the blizzard on that mountain. We all agreed never to go back.`],
    ['robin', c => `Frost mage from the ${c.d}! He slows us? Splendid, I am the slowest already. I mean, wisely cautious.`],
    ['czarny', c => `Frost mage from the ${c.d}? He will freeze my stumps. One more thing I cannot feel.`],
  ],
  stormCall: [
    ['gandalf', c => `Storm mage from the ${c.d}. Watch the red ring on the ground. Lightning strikes there. Step aside!`],
    ['rincewind', c => `Storm mage from the ${c.d}! Lightning hits where the ring is. Funny, I always run where there is no ring.`],
    ['tim', c => `Storm mage from the ${c.d}! Thunder and lightning! Good thing we have a lightning rod. Oh wait. We do not.`],
  ],
  necroCall: [
    ['maynard', c => `Necromancer from the ${c.d}. He summons the dead. Sire, I am fairly sure the Book forbids this.`],
    ['gandalf', c => `Necromancer from the ${c.d}. I do not like the dead coming back uninvited. Especially goblins.`],
    ['dennis', c => `Necromancer from the ${c.d}! I am not dead yet! I do not want to join that crowd!`],
  ],
  icedragonCall: [
    ['gandalf', c => `Ice dragon from the ${c.d}. Finally, something to cool down the atmosphere. Literally.`],
    ['gimli', c => `Ice dragon from the ${c.d}! The gold will freeze, but it will still be mine!`],
    ['patsy', c => `Ice dragon from the ${c.d}, sire! I only have coconuts. They will freeze.`],
  ],
  poisondragonCall: [
    ['gandalf', c => `Venom dragon from the ${c.d}. Poisonous breath. Good thing I have my pipe. It cleanses everything.`],
    ['rincewind', c => `Venom dragon from the ${c.d}! Green, toxic and huge. Three good reasons to run!`],
    ['sam', c => `Poison dragon from the ${c.d}, Mr. Frodo. He does not look like he likes potatoes.`],
  ],
  elfDead: [
    ['gimli', "The elf is down! Write it in the chronicles. Under the name Gimli!"],
    ['legolas', "The dark elf has fallen. He was less handsome than me even before that."],
    ['robin', "The elf is out of the game! Never mind that he looked rather nice. Good work."],
  ],
  necroSummon: [
    ['maynard', "The necromancer raised goblins! Sire, we have new neighbours, and they are not friendly!"],
    ['dennis', "They came out of the ground! Even the dead get more work than I do!"],
    ['gandalf', "Goblins risen from the dead. That should not be possible. Yet here we are. As usual."],
  ],
  shamanBuff: [
    ['gimli', "The shaman empowered the orcs with green magic! They run faster and hit harder. Wonderful."],
    ['gandalf', "Green magic on the orcs! Sometimes it is better not to know how it works."],
    ['patsy', "The orcs are glowing green, sire! They have even more enthusiasm now!"],
    ['tim', "He boosted their power! That is cheating. I never do that. Almost never."],
  ],
  dragonBreath: [
    ['artur', "The dragon takes a breath! Take cover!"],
    ['robin', "The dragon is puffing up! Changing my plan to running away!"],
    ['gandalf', "Beware the dragon's breath! Hide behind anything!"],
    ['rincewind', "The dragon is inhaling! That is never a good sign! Never!"],
  ],
  slowed: [
    ['robin', "I am slowed! I will run away exactly as before, only slower!"],
    ['gimli', "I am frozen! And without any ale!"],
    ['sam', "Mr. Frodo, I cannot feel my toes. I hope I still have all ten."],
    ['czarny', "Frozen? It is only a flesh wound."],
    ['tim', "I move like a snail! But I still enchant like a very fast snail!"],
  ],
  poisoned: [
    ['robin', "Poisoned! I knew I should not have drunk from that chalice!"],
    ['gimli', "Poison! Dwarves are resistant. Mostly. A bit. I take it back."],
    ['maynard', "Poisoned! Sire, will you heal me? Sire? Hello?"],
  ],
  burning: [
    ['robin', "I am burning! Burning! Does anyone have a bucket? Or two?"],
    ['gandalf', "Fire! Usually I am the one throwing it. A strange feeling."],
    ['sam', "I am on fire, Mr. Frodo! At least the potatoes will be warm!"],
    ['patsy', "I am on fire, sire! The coconuts will be roasted!"],
    ['rincewind', "Fire! Running away! I know it does not help! But I love it!"],
  ],
  cursed: [
    ['tim', "My mana! She took my mana! How will I cast now?"],
    ['gandalf', "The dark elf's curse! I felt the magic leave me. Like forgetting my own name."],
    ['rincewind', "Mana drained! Good thing I never had any."],
    ['legolas', "The curse drained my strength! Even my hair lost its shine."],
  ],
  orkCall2: [
    ['robin', c => `Orcs from the ${c.d}! They smell like a stable after rain. Not me, I swear.`],
    ['artur', c => `Orcs from the ${c.d}! Remain calm, men. And if possible, be polite about it.`],
    ['gimli', c => `Orcs from the ${c.d}! There are so many, we could count them until evening.`],
    ['gandalf', c => `Orcs from the ${c.d}. Good old classic. Like this hat.`],
  ],
});
