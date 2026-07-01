// Topic introductions shown before every new topic in session.
// Each entry is an array of paragraph strings — pitched at 3rd class level (age 8-9).
const INTROS = {
  english: {
    grammar: [
      'Grammar is the set of rules that helps us speak and write clearly so that other people can understand us. Just like a game has rules, language has grammar rules that everyone follows.',
      'In 3rd class, you will learn about different types of words called parts of speech. A noun is the name of a person, place, thing or idea (cat, Dublin, kindness). A verb is an action or doing word (run, jump, think). An adjective describes a noun (big, happy, red). An adverb describes a verb (quickly, loudly, carefully).',
      'You will also learn about sentences. Every sentence must have a subject (who or what the sentence is about) and a verb (what they do). "The dog barked" — "the dog" is the subject and "barked" is the verb.',
      'Tip: When you read a sentence, try to spot the noun and the verb — you\'ll be surprised how quickly you get good at it!',
    ],
    spelling: [
      'Spelling is learning to put the correct letters in the right order to write words. English spelling can be tricky because words are not always spelled exactly the way they sound.',
      'The best way to improve spelling is to learn spelling patterns rather than memorising every word separately. For example: words ending in -tion (station, nation, attention) — once you know that pattern, you can spell hundreds of words!',
      'Other important patterns include: -ing (running, jumping), -ed (jumped, walked), -ful (careful, hopeful), -less (careless, hopeless), and -ness (kindness, sadness). These are called suffixes — they are added to the end of words to change their meaning.',
      'A great trick for hard words is "Look, Cover, Write, Check" — look at the word carefully, cover it up, write it from memory, then check if you were right. Do this three times and most words will stick!',
    ],
    reading: [
      'Reading is one of the most important skills you will ever learn. It lets you explore amazing stories, discover incredible facts, and understand the world around you.',
      'Good readers do more than just say the words — they also think about what they are reading. They ask questions like: What is happening? Why did the character do that? What will happen next? How does this make me feel?',
      'When you read a passage, there are two types of information. Explicit information is stated directly in the text — you can point to the exact words. Implicit information (or inference) is not stated directly — you have to use clues in the text and your own knowledge to work it out.',
      'For example, if a story says "Sophie stamped her foot and crossed her arms," the text does not say she is angry — but you can infer it from her actions!',
      'Tip: After you finish reading a passage, try to summarise it in two or three sentences. This helps you check that you understood the main ideas.',
    ],
    writing: [
      'Writing is a powerful way to share your ideas, stories and feelings with others. Great writers do not just sit down and write — they plan first!',
      'There are many different types of writing. A narrative tells a story with characters, a setting and a plot. A recount describes something that really happened (like a diary entry). A report gives information about a topic. A persuasive text tries to convince the reader of something.',
      'Every piece of writing should have a clear structure: a beginning (introduction), a middle (development/body) and an end (conclusion). In a story, the beginning introduces the characters and setting, the middle builds up the problem or adventure, and the ending resolves everything.',
      'To make your writing more interesting, use ambitious vocabulary (instead of "said", try "whispered", "shouted", "exclaimed"), use adjectives to describe things, and vary your sentence length — short sentences add excitement, longer ones build atmosphere.',
    ],
    punctuation: [
      'Punctuation marks are signs we use in writing to help readers understand what we mean. Without punctuation, writing would be very confusing to read!',
      'The most common punctuation marks are: the full stop (.) used at the end of a sentence; the question mark (?) used at the end of a question; the exclamation mark (!) used to show surprise or strong feeling; and the comma (,) used to separate items in a list or to add a pause.',
      'Speech marks (" ") show exactly what someone said. They always go around the spoken words, and there is always a comma, full stop, question mark or exclamation mark before the closing speech marks. Example: "I love reading," said Emma.',
      'Capital letters are used at the start of every sentence, for the word "I", and for proper nouns (names of people, places, days of the week, months of the year).',
    ],
    vocabulary: [
      'Vocabulary means all the words you know and understand. The more words you know, the better you can express yourself and understand what you read.',
      'When you come across a new word, try these steps: first, look at the context (the words around it) to guess the meaning. Then think about parts of the word — does it have a prefix (un-, re-, pre-) or a suffix (-tion, -ful, -less) that gives a clue? Finally, look it up in a dictionary to confirm the meaning.',
      'Common prefixes to know: un- (not, e.g. unhappy), re- (again, e.g. replay), pre- (before, e.g. prehistoric), mis- (wrongly, e.g. misunderstand). Common suffixes: -tion (action/state), -ful (full of), -less (without), -ness (a quality).',
      'Try to use new words in your own sentences — this is the best way to remember them. Aim to learn at least two or three new words every week!',
    ],
    'compound-words': [
      'A compound word is a new word made by joining two separate words together. When the two words join, they create a brand new meaning!',
      'Examples: rain + bow = rainbow 🌈, sun + flower = sunflower 🌻, foot + ball = football ⚽, butter + fly = butterfly 🦋, book + shelf = bookshelf 📚. Can you see how each new word has its own meaning, different from the two original words?',
      'Some compound words are written as one word (bedroom, seaside), some with a hyphen (well-known, up-to-date), and some as two separate words (ice cream, bus stop). As you read more, you will start to recognise them easily.',
    ],
    plurals: [
      'Plurals are words that mean more than one of something. In English, there are regular plurals and irregular plurals.',
      'Regular plurals just add -s (cat → cats, dog → dogs, book → books). But words ending in -s, -ss, -sh, -ch or -x add -es (bus → buses, dish → dishes, box → boxes). Words ending in a consonant + y change the y to -ies (baby → babies, city → cities).',
      'Irregular plurals do not follow the rules — you have to learn them separately! Here are some important ones: child → children, mouse → mice, tooth → teeth, foot → feet, person → people, sheep → sheep (no change!), goose → geese.',
    ],
  },
  maths: {
    addition: [
      'Addition is one of the four main operations in maths. It means putting two or more amounts together to find a total (or sum).',
      'In 3rd class, you will add numbers up to 999 and beyond. Important strategies to practise: counting on from the bigger number, using number bonds (pairs of numbers that add to 10, 20, 100), and column addition where you line up units, tens and hundreds.',
      'Remember: when you add the digits in a column and get 10 or more, you "carry" the extra ten across to the next column. This is called regrouping.',
      'Example: 347 + 256 = ? Units: 7+6=13, write 3 carry 1. Tens: 4+5+1=10, write 0 carry 1. Hundreds: 3+2+1=6. Answer: 603.',
    ],
    subtraction: [
      'Subtraction means finding the difference between two numbers, or taking one amount away from another.',
      'There are three ways to think about subtraction: taking away (8 − 3 = 5), finding the difference (what is the difference between 8 and 3?), and counting back (start at 8, count back 3 steps).',
      'When you subtract using columns and the top digit is smaller than the bottom digit, you need to "borrow" (regroup) from the next column. This is the trickiest part — but with practice it becomes automatic!',
      'Subtraction and addition are inverse operations — they undo each other. You can always check a subtraction answer by adding: if 47 − 19 = 28, then 28 + 19 should equal 47.',
    ],
    multiplication: [
      'Multiplication is a fast way of doing repeated addition. Instead of adding 6 + 6 + 6 + 6, you can simply calculate 6 × 4 = 24.',
      'In 3rd class, you should know your multiplication tables from 1 to 10 by heart. The more you practise, the faster you will recall them — and this will help you in almost every other area of maths!',
      'Key facts to remember: any number × 1 = itself; any number × 0 = 0; any number × 10 = just add a zero; multiplication is commutative — 3 × 7 gives the same answer as 7 × 3 (both = 21).',
      'Tables tips: For the 9 times table, hold up all 10 fingers. To multiply 9 × 4, fold down the 4th finger — you have 3 fingers to the left and 6 to the right: answer = 36!',
    ],
    division: [
      'Division means splitting a number into equal groups, or finding out how many times one number goes into another.',
      'Division is the inverse (opposite) of multiplication. If you know 4 × 7 = 28, you automatically know 28 ÷ 7 = 4 and 28 ÷ 4 = 7. That is why learning your times tables also teaches you division!',
      'There are two ways to think about division: sharing (24 apples shared equally among 4 children → 24 ÷ 4 = 6 each) and grouping (24 apples put into groups of 4 → how many groups? 24 ÷ 4 = 6 groups).',
      'Sometimes division does not come out evenly and there is a remainder. For example: 25 ÷ 4 = 6 remainder 1 (because 4 × 6 = 24, and 25 − 24 = 1 left over).',
    ],
    fractions: [
      'A fraction shows part of a whole thing. When something is divided into equal parts, each part is a fraction of the whole.',
      'A fraction has two parts: the denominator (bottom number) tells you how many equal parts the whole has been divided into; the numerator (top number) tells you how many of those parts you have. In ¾ — the denominator is 4 (divided into 4 equal parts) and the numerator is 3 (we have 3 of them).',
      'Equivalent fractions look different but have the same value. ½ = 2/4 = 3/6 = 4/8. To make an equivalent fraction, multiply (or divide) both the numerator and denominator by the same number.',
      'To compare fractions with the same denominator, just look at the numerator — the bigger the numerator, the bigger the fraction. ⅗ > ⅖ because 3 > 2.',
    ],
    'place-value': [
      'Place value means the value of each digit in a number depends on its position. The same digit can have a very different value depending on where it sits!',
      'In a 3-digit number like 456: the 6 is in the units column (worth 6), the 5 is in the tens column (worth 50), and the 4 is in the hundreds column (worth 400). So 456 = 400 + 50 + 6.',
      'In 3rd class you will work with numbers up to 999 and start exploring 4-digit numbers (thousands). In 3,456: the 3 is in the thousands column (worth 3,000), the 4 is hundreds (400), 5 is tens (50), and 6 is units (6).',
      'Tip: When you read or write a large number, always start from the highest value column on the left and work to the right.',
    ],
    measurement: [
      'Measurement means finding the size or amount of something using standard units that everyone agrees on, so we can compare fairly.',
      'Length: we measure short lengths in millimetres (mm) and centimetres (cm), longer distances in metres (m), and very long distances in kilometres (km). Key facts: 10 mm = 1 cm; 100 cm = 1 m; 1,000 m = 1 km.',
      'Weight (mass): we use grams (g) for lighter objects and kilograms (kg) for heavier ones. 1,000 g = 1 kg. A bag of sugar weighs 1 kg; a grape weighs about 5 g.',
      'Capacity (how much a container holds): millilitres (ml) for small amounts and litres (l) for larger amounts. 1,000 ml = 1 l. A large bottle of water holds 2 litres; a teaspoon holds about 5 ml.',
    ],
    time: [
      'Time is how we measure the passing of events and the order in which things happen. We use many different units of time depending on how long something lasts.',
      'Key units: 60 seconds = 1 minute; 60 minutes = 1 hour; 24 hours = 1 day; 7 days = 1 week; approximately 4 weeks = 1 month; 12 months = 1 year; 365 days = 1 year (366 in a leap year).',
      'In 3rd class you will read analogue clocks (with hands) to the nearest minute. The short hand shows the hour; the long hand shows the minutes. When the long hand points to 12, it is "o\'clock"; when it points to 6, it is "half past".',
      'You will also use the 24-hour clock (sometimes called digital time). After 12:00 noon, the hours continue to 13:00, 14:00... up to 23:59. Midnight is 00:00.',
    ],
    shapes: [
      'Shapes are all around us — in buildings, nature, art and everyday objects. In maths, we study 2D shapes (flat) and 3D shapes (solid).',
      'Key 2D shapes: triangle (3 sides, 3 angles), quadrilateral (4 sides — includes square, rectangle, rhombus, trapezium), pentagon (5 sides), hexagon (6 sides), octagon (8 sides), circle (curved, no straight sides).',
      'Key 3D shapes: cube (6 square faces), cuboid (6 rectangular faces), sphere (perfectly round), cylinder (circular top and bottom with curved sides), cone (circular base tapering to a point), triangular prism (triangular ends).',
      'Properties to notice: the number of faces (flat surfaces), edges (where two faces meet) and vertices (corners). A cube has 6 faces, 12 edges and 8 vertices.',
    ],
    money: [
      'We use the euro (€) as our currency in Ireland. The euro is divided into 100 cent. So €1 = 100c, €2 = 200c, and so on.',
      'Coins we use: 1c, 2c, 5c, 10c, 20c, 50c, €1 and €2. Notes: €5, €10, €20, €50. When handling money, it is important to find the most efficient combination of coins and notes.',
      'Adding prices: line up the decimal points and add normally. €2.35 + €1.70 = €4.05. Calculating change: subtract the cost from the amount paid. If something costs €3.60 and you pay €5, your change is €5 − €3.60 = €1.40.',
    ],
    data: [
      'Data is information we collect and record. We then organise and display data so it is easy to read and compare.',
      'Types of data display: tally chart (quick way to record counts using strokes), bar chart (uses bars of different heights to compare categories), pictogram (uses pictures to represent data — check the key!), pie chart (circle divided into sections), line graph (shows how data changes over time).',
      'When reading a chart, always check: the title (what the chart is about), the labels on the axes, and the scale (what each unit on the axis represents).',
      'When we collect and interpret data, we can find the range (biggest value − smallest value), the mode (most common value), and sometimes the mean (average — add all values and divide by how many there are).',
    ],
    'mental-maths': [
      'Mental maths means calculating in your head without writing anything down. It is a very useful everyday skill — for working out change, estimating distances, or quickly checking answers.',
      'Useful strategies: rounding (round 49 to 50, calculate, then adjust); partitioning (break 67 + 35 into 60+30=90 and 7+5=12, then add: 90+12=102); doubles and near doubles (14+15 = double 14 +1 = 29); number bonds to 10 and 100.',
      'Estimation is also a key mental maths skill. Before you calculate, estimate the answer. If 48 × 4 ≈ 50 × 4 = 200, then your exact answer should be close to 200. This helps you spot silly mistakes!',
    ],
    'word-problems': [
      'Word problems are maths questions written as a short story or real-life situation. To solve them, you need to read carefully and identify what maths to use.',
      'Follow these steps: (1) Read the problem carefully — twice if needed. (2) Underline or highlight the numbers and the key question. (3) Decide which operation to use (+, −, ×, ÷). (4) Write a number sentence. (5) Solve and check if your answer makes sense.',
      'Key words that signal operations: MORE THAN, SUM, TOTAL, ALTOGETHER → addition; LESS THAN, DIFFERENCE, HOW MANY MORE, TAKE AWAY → subtraction; TIMES, GROUPS OF, PRODUCT → multiplication; SHARE EQUALLY, DIVIDED INTO, HOW MANY EACH → division.',
    ],
  },
  history: {
    'ancient-ireland': [
      'Ancient Ireland is the story of the very first people who lived on this island, thousands of years before writing was invented.',
      'The Stone Age people arrived in Ireland around 8,000 BC, crossing a land bridge from Britain. They were hunter-gatherers who lived by fishing, hunting animals and gathering berries and nuts. Later, around 4,000 BC, the first farmers arrived and began growing crops and raising animals.',
      'These early people built incredible stone monuments that are still standing today. Newgrange in County Meath was built around 3,200 BC — that is over 5,000 years ago, making it older than Stonehenge in England and even the Egyptian pyramids! Every winter, on the shortest day of the year, sunlight shines directly into the heart of the tomb.',
      'Later came the Bronze Age (around 2,500 BC), when people learned to make tools and weapons from bronze. They also made beautiful gold jewellery — examples can be seen in the National Museum in Dublin.',
    ],
    vikings: [
      'The Vikings were warriors and seafarers from Scandinavia (modern-day Norway, Sweden and Denmark). They were expert boat builders who could sail in shallow rivers as well as the open ocean.',
      'The first Viking raid on Ireland happened in 795 AD when they attacked Rathlin Island off the coast of Antrim. Over the next 200 years, they raided monasteries all around Ireland, stealing gold, cattle and enslaving people.',
      'However, the Vikings were not only raiders — they were also traders and settlers. They founded the first proper towns in Ireland: Dublin (from the Irish Dubh Linn, meaning "black pool"), Waterford, Limerick, Cork and Wexford were all established as Viking trading ports.',
      'The Vikings mixed with the Irish over time, converting to Christianity and adopting Irish customs. The Battle of Clontarf in 1014 AD, led by the High King Brian Boru, broke the power of the Vikings in Ireland, although they continued to live in the towns they had founded.',
    ],
    normans: [
      'The Normans were a people from Normandy in northern France who had themselves descended from Viking settlers. They were famous for their military skill and their stone castle building.',
      'Normans came to Ireland in 1169 AD, invited by the King of Leinster, Dermot MacMurrough, who wanted help to reclaim his kingdom. Led by a knight called Strongbow, they quickly conquered large parts of Ireland.',
      'King Henry II of England came to Ireland in 1171 AD, making Ireland subject to the English crown — a relationship that would last for nearly 750 years.',
      'The Normans built hundreds of stone castles across Ireland to control the land. They introduced the feudal system (where land was given to loyal knights), new farming methods including the water mill, and brought the English language to parts of Ireland.',
    ],
    'famous-irish-people': [
      'Ireland is a small island, but it has produced an enormous number of remarkable people who have changed the world in science, literature, sport, politics and the arts.',
      'In literature: Oscar Wilde (1854–1900) was a brilliant playwright and author from Dublin known for his wit. W.B. Yeats (1865–1939) is Ireland\'s greatest poet and won the Nobel Prize for Literature. Roddy Doyle and Marian Keyes are popular modern Irish authors.',
      'In science: Ernest Walton from Waterford was the first person ever to split the atom in 1932 — winning the Nobel Prize in Physics. Kathleen Lonsdale from Kildare became one of the world\'s first female Fellows of the Royal Society.',
      'In history and politics: Daniel O\'Connell (1775–1847) won Catholic Emancipation without violence, earning him the title "The Liberator." Grace O\'Malley (Gráinne Mhaol, c.1530–1603) was a famous pirate queen from Mayo who ruled the west coast of Ireland.',
    ],
    'irish-history': [
      'Irish history stretches back thousands of years and is filled with extraordinary events, brave people, terrible hardships and great achievements.',
      'The Great Famine (1845–1852) was one of the most devastating events in Irish history. A disease destroyed the potato crop — which was the main food of the poor — for several years in a row. About one million people died of starvation and disease, and another million emigrated to escape. Ireland\'s population fell from around 8 million to under 6 million in just a few years.',
      'The fight for Irish independence reached its peak with the Easter Rising of 1916, when a small group of Irish republicans took over the GPO in Dublin and declared Ireland a Republic. Although the Rising was defeated within a week and the leaders were executed, it changed Irish public opinion and led to the War of Independence (1919–1921).',
      'Ireland became a Free State in 1922 and a fully independent Republic in 1949. Today, Ireland is a modern, outward-looking country and a member of the European Union.',
    ],
    'world-history': [
      'World history is the story of how human civilisation began and developed across all the different continents and cultures of the Earth.',
      'Ancient Egypt (3,100 BC–30 BC) was one of the world\'s greatest early civilisations, based along the Nile River in Africa. The Egyptians built the pyramids as tombs for their pharaohs (kings), invented hieroglyphics (picture writing), and made important advances in medicine, mathematics and astronomy.',
      'Ancient Greece (800 BC–146 BC) gave the world democracy (a system where citizens vote), the Olympic Games, philosophy (the love of wisdom), and groundbreaking work in science and mathematics. Philosophers like Socrates, Plato and Aristotle still influence how we think today.',
      'The Roman Empire (27 BC–476 AD) conquered most of Europe, North Africa and parts of the Middle East. The Romans built amazing roads, aqueducts (to carry water), baths and amphitheatres. Latin, the language of the Romans, is the root of French, Spanish, Italian and Portuguese — and about half of all English words!',
    ],
  },
  geography: {
    ireland: [
      'Ireland is an island located on the north-western edge of Europe, surrounded by the Atlantic Ocean to the west and the Irish Sea to the east.',
      'The island is divided into 32 counties and four provinces: Leinster (eastern Ireland, 12 counties), Munster (southern Ireland, 6 counties), Connacht (western Ireland, 5 counties) and Ulster (northern Ireland, 9 counties). The Republic of Ireland has 26 counties; Northern Ireland (part of the United Kingdom) has 6.',
      'Physical features: Ireland is shaped like a saucer — mountains around the edges with a low central plain in the middle. The highest mountain is Carrauntoohil in Co. Kerry (1,038 m). The longest river is the River Shannon (360 km), which flows from Co. Cavan to Limerick. Ireland has over 14,000 km of coastline.',
      'Ireland\'s climate is mild and wet, influenced by the warm Gulf Stream current from the Atlantic Ocean. We rarely get very hot summers or very cold winters — but we do get a lot of rain, which is why the island is so lush and green!',
    ],
    'continents-oceans': [
      'A continent is one of the seven large areas of land on Earth. An ocean is one of the five major bodies of salt water that cover most of our planet.',
      'The seven continents, from largest to smallest: Asia (the largest — home to China, India, Russia and 44 other countries), Africa (54 countries, home to the Sahara Desert and the Nile River), North America, South America, Antarctica (covered in ice, no permanent population), Europe (includes Ireland!), and Australia/Oceania (the smallest).',
      'The five oceans, from largest to smallest: Pacific Ocean (the largest — covers nearly half the Earth\'s surface), Atlantic Ocean (between the Americas and Europe/Africa), Indian Ocean, Southern Ocean (around Antarctica), Arctic Ocean (the smallest, around the North Pole).',
      'The continents and oceans are not fixed — over millions of years, the continents slowly drift on huge plates of rock. This is called plate tectonics. Long ago, all the continents were joined into one giant supercontinent called Pangaea!',
    ],
    weather: [
      'Weather is the condition of the atmosphere (the air around the Earth) at a particular place and time. It can change hour by hour or day by day.',
      'Weather is described by: temperature (how hot or cold — measured in degrees Celsius °C), precipitation (rain, sleet, snow or hail), wind (speed measured in km/h or knots, direction shown by compass bearing), cloud cover (described as clear, partly cloudy, overcast), and visibility (how far you can see).',
      'Climate is the average weather pattern for a place over a long period (usually 30 years). Ireland has a temperate maritime climate — mild temperatures year-round, quite wet, not many extremes.',
      'Weather is measured using instruments: thermometer (temperature), rain gauge (rainfall amount), anemometer (wind speed), weather vane (wind direction), barometer (air pressure). Meteorologists use satellites, weather stations and computer models to forecast the weather.',
    ],
    environment: [
      'The environment means everything that surrounds us — the air we breathe, the water we drink, the soil we grow food in, the plants and animals we share the planet with.',
      'Human activity is affecting the environment in serious ways. Burning fossil fuels (coal, oil, gas) releases carbon dioxide into the atmosphere, causing global warming and climate change — which leads to more extreme weather, rising sea levels and threats to wildlife.',
      'We can all help protect the environment. The key ideas are: Reduce (use less — turn off lights, walk instead of driving), Reuse (use things again instead of throwing them away), Recycle (put the right things in the recycling bin so materials can be made into new products).',
      'Biodiversity means the variety of living things in an ecosystem. Ireland\'s bogs, hedgerows, rivers and coasts are home to many rare species. Protecting these habitats is vital for keeping our ecosystem healthy.',
    ],
  },
  science: {
    plants: [
      'Plants are living things that are essential to almost all life on Earth. They make their own food using a process called photosynthesis.',
      'Photosynthesis: plants use sunlight (energy), water (absorbed through roots) and carbon dioxide (from the air through tiny holes in leaves called stomata) to produce glucose (sugar for energy) and oxygen (which they release into the air). Formula: sunlight + water + CO₂ → glucose + oxygen.',
      'Parts of a plant and their jobs: roots (absorb water and minerals from soil, anchor the plant), stem (carries water and food between roots and leaves, supports the plant), leaves (make food using sunlight), flowers (attract insects for pollination), seeds (allow the plant to reproduce and spread).',
      'Plants are the start of almost every food chain on Earth. Animals that eat plants are called herbivores, and animals that eat other animals are called carnivores. Humans who eat both are called omnivores.',
    ],
    animals: [
      'Animals are living things that can move, feed, breathe, grow, and reproduce. There are millions of different species (types) of animals on Earth, from the tiny ant to the enormous blue whale.',
      'Animals are classified into two main groups: vertebrates (animals with a backbone/spine) and invertebrates (animals without a backbone). Vertebrates are further divided into five groups: fish, amphibians, reptiles, birds and mammals.',
      'Mammals are warm-blooded, usually have fur or hair, and feed their young on milk. Humans, dogs, dolphins, bats and whales are all mammals. Birds are warm-blooded, have feathers and wings, and lay eggs. Fish are cold-blooded, breathe through gills, and live in water.',
      'Animals live in habitats that suit their needs — rainforest, desert, ocean, grassland, arctic. Each animal has adaptations (special features) that help it survive in its habitat. For example, a camel has a hump to store fat for energy, wide flat feet for sand, and long eyelashes to keep sand out.',
    ],
    'living-things': [
      'All living things — plants, animals, fungi, bacteria — share seven life processes. Scientists use the acronym MRSGREN to remember them.',
      'MRSGREN: Movement (all living things move, even plants turn towards light), Respiration (releasing energy from food — breathing in animals, chemical process in plants), Sensitivity (reacting to the environment — light, sound, touch), Growth (all living things grow and develop), Reproduction (making more of themselves), Excretion (getting rid of waste products), Nutrition (taking in food or making food).',
      'Living things are also organised into a classification system: Kingdom → Phylum → Class → Order → Family → Genus → Species. The species is the most specific group — organisms of the same species can reproduce together.',
      'Non-living things (like rocks, water, air) do not carry out all seven life processes. Some things that were once alive (like wood, coal) are called formerly living.',
    ],
    'human-body': [
      'The human body is an amazing machine made up of trillions of tiny cells that work together in organs and systems to keep you alive and healthy.',
      'Key body systems: Skeletal system — 206 bones that protect organs, allow movement and produce blood cells. Muscular system — over 600 muscles that move your body by contracting. Digestive system — breaks down food into nutrients your body can use. Circulatory system — heart pumps blood around the body, delivering oxygen and nutrients.',
      'Respiratory system — lungs take in oxygen from the air and remove carbon dioxide. Nervous system — brain, spinal cord and nerves send signals around the body, controlling everything you do. Immune system — protects the body from diseases by producing antibodies.',
      'Staying healthy: eat a balanced diet with plenty of fruit and vegetables, get at least 60 minutes of physical activity every day, drink 6–8 glasses of water, get 9–11 hours of sleep, and wash your hands regularly to prevent spreading germs.',
    ],
    materials: [
      'Materials are the substances that objects are made from. Scientists group materials by their properties — the characteristics that tell us how a material behaves.',
      'Common materials and their properties: wood (strong, light, good insulator, can be shaped); metal (hard, strong, conducts heat and electricity, shiny when polished); plastic (lightweight, waterproof, can be moulded into any shape, does not conduct electricity); glass (transparent, waterproof, brittle/breaks easily); fabric (flexible, can be woven into different patterns, soft).',
      'Scientists test materials for specific properties: strength (how much force it can withstand before breaking), flexibility (how easily it bends without snapping), waterproofing (does water pass through it?), transparency (can you see through it?), thermal conductivity (does it let heat pass through?).',
      'The right material must be chosen for the right job. A window must be made of glass (transparent) not wood (opaque). A cooking pot must conduct heat, so metal is used. A raincoat must be waterproof, so we use nylon or treated fabric.',
    ],
    forces: [
      'A force is a push or a pull. Forces can change the speed, direction or shape of an object. Forces are measured in Newtons (N), named after the scientist Isaac Newton.',
      'Gravity is a force that pulls all objects towards each other. On Earth, gravity pulls everything towards the centre of the Earth — that is why things fall when you drop them, and why you stay on the ground! The Moon has weaker gravity than Earth (about 1/6 of Earth\'s gravity), which is why astronauts bounce when they walk on the Moon.',
      'Friction is the force that acts between two surfaces that are touching and moving against each other. Friction slows things down. Rough surfaces create more friction than smooth surfaces. Friction can be useful (it lets your shoes grip the floor) or a nuisance (it slows down cars and machinery).',
      'Air resistance is the friction between a moving object and the air — it slows down anything moving through air. Water resistance does the same in water. Streamlined shapes (like aircraft and fish) are designed to reduce air and water resistance.',
    ],
    energy: [
      'Energy is the ability to do work. Everything that happens — a ball rolling, a light bulb glowing, a plant growing — involves energy.',
      'There are many forms of energy: kinetic energy (movement), potential energy (stored, e.g. a ball held up high), thermal energy (heat), light energy, sound energy, electrical energy, chemical energy (stored in food and fuel).',
      'A key law of science is the conservation of energy: energy cannot be created or destroyed, only changed from one form to another. When you eat food (chemical energy), your body converts it to kinetic energy (movement) and thermal energy (heat).',
      'Renewable energy comes from sources that will not run out — solar (sun), wind, hydro (water), geothermal (heat from the Earth). Non-renewable energy comes from fossil fuels (coal, oil, natural gas) that took millions of years to form and will eventually run out.',
    ],
    'light-sound': [
      'Light is a form of energy that travels in waves at an incredible speed — about 300,000 kilometres per second (fast enough to travel around the Earth seven times in one second!). Light travels in straight lines.',
      'Light can be reflected (bounced off surfaces — mirrors reflect almost all light), refracted (bent as it passes from one material to another — this is why a spoon looks bent in a glass of water), and absorbed (dark materials absorb light and convert it to heat). We see objects because light bounces off them into our eyes.',
      'Sound is also a form of energy that travels in waves, but much more slowly than light — about 340 m/s in air. Sound is made when objects vibrate. The vibrations travel through materials (solids, liquids and gases) as waves of pressure.',
      'Sound cannot travel through empty space (a vacuum) — there is no air in space, so no sound waves can travel. This is why you cannot hear any sounds in outer space. Pitch (how high or low a sound is) is measured in hertz (Hz). Loudness is measured in decibels (dB).',
    ],
  },
  irish: {
    vocabulary: [
      'Gaeilge (Irish) is Ireland\'s first official language and has been spoken on this island for over 2,500 years. It is a Celtic language, closely related to Scottish Gaelic and Welsh.',
      'Even though most people in Ireland speak English as their main language, Irish is taught in every school and is used in the Gaeltacht — areas along the west coast of Ireland where Irish is still spoken as a community language every day.',
      'Learning even basic Irish vocabulary helps you connect with Ireland\'s ancient culture and history. Many Irish words have made their way into everyday English — words like "galore" (go leor), "smithereens" (smidiríní), "slogan" (sluaghairm) and "brogue" (bróg) all come from Irish!',
    ],
    phrases: [
      'Learning common phrases in Irish allows you to greet people, hold simple conversations, and connect with Ireland\'s ancient language tradition.',
      'Greetings: Dia duit (Hello — literally "God to you"), Dia is Muire duit (the response to a greeting), Conas atá tú? (How are you?), Tá mé go maith (I am well), Go raibh maith agat (Thank you), Tá fáilte romhat (You\'re welcome), Slán (Goodbye).',
      'In school: Ar mhaith leat...? (Would you like...?), Cad is ainm duit? (What is your name?), [Ainm] is ainm dom ([Name] is my name), Cá bhfuil...? (Where is...?), Oscail do leabhar (Open your book), Dún do leabhar (Close your book).',
    ],
    numbers: [
      'Numbers in Irish are a key building block of the language. They follow patterns just like in English, although the words are very different!',
      '1–10: a haon (1), a dó (2), a trí (3), a ceathair (4), a cúig (5), a sé (6), a seacht (7), a hocht (8), a naoi (9), a deich (10).',
      '11–20: a haon déag (11), a dó dhéag (12), a trí déag (13), a ceathair déag (14), a cúig déag (15), a sé déag (16), a seacht déag (17), a hocht déag (18), a naoi déag (19), fiche (20).',
      'Tens: tríocha (30), daichead (40), caoga (50), seasca (60), seachtó (70), ochtó (80), nócha (90), céad (100). Practice counting objects in Irish — it makes the numbers stick much faster!',
    ],
    colours: [
      'Colours in Irish are called dathanna. Learning them is really useful because you can use them to describe almost everything around you!',
      'The main colours: dearg (red), gorm (blue), glas (green), buí (yellow), oráiste (orange), corcra (purple), bán (white), dubh (black), liath (grey), donn (brown), bándearg/pinc (pink).',
      'In Irish, adjectives (describing words) usually come AFTER the noun, unlike in English where they come before. So "a red car" in Irish is "carr dearg" (car red). This is a key difference between the two languages.',
      'Fun fact: Ireland\'s national colour is green (glas) — which is why Ireland is called "the Emerald Isle" and why the Irish sports team wears green. The shamrock (seamróg) is Ireland\'s national plant.',
    ],
  },
  genknow: {
    space: [
      'Space is the vast region beyond Earth\'s atmosphere. It is so enormous that distances are measured in light-years — the distance light travels in one year (about 9.5 trillion kilometres).',
      'Our Solar System: the Sun is a medium-sized star at the centre, surrounded by eight planets in order from closest to farthest: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. A useful mnemonic: "My Very Excited Mother Just Served Us Noodles."',
      'Earth is the only planet in our Solar System known to support life. It has the perfect conditions: liquid water, an atmosphere containing oxygen, and a temperature range that allows life to exist.',
      'Beyond our Solar System is our galaxy, the Milky Way — a spiral galaxy containing over 200 billion stars. Beyond that are hundreds of billions of other galaxies in the observable universe. The universe began about 13.8 billion years ago in an event called the Big Bang.',
    ],
    animals: [
      'Animals are one of the five kingdoms of living things and are found on every continent and in every ocean on Earth. There are estimated to be over 8 million species of animals on our planet!',
      'Animal record-breakers: the blue whale is the largest animal that has ever lived (up to 30 m long and 150 tonnes). The cheetah is the fastest land animal (up to 120 km/h). The peregrine falcon is the fastest animal on Earth (over 300 km/h in a dive). The Arctic tern migrates the furthest — from the Arctic to the Antarctic and back each year (about 70,000 km!).',
      'Adaptation is how animals develop special features to survive in their environment over thousands of generations. Polar bears have thick white fur for camouflage in snow and to keep warm. Giraffes have long necks to reach leaves high in trees. Deep-sea fish produce their own light in the dark ocean depths.',
    ],
    'world-facts': [
      'Our planet Earth is approximately 4.5 billion years old and is the third planet from the Sun. It is the only planet in the solar system known to support life.',
      'Earth by numbers: diameter of approximately 12,742 km; surface covered 71% by water and 29% by land; home to approximately 8 billion humans speaking over 7,000 languages; 195 countries recognised by the United Nations.',
      'World record facts: the Amazon Rainforest is the world\'s largest rainforest, home to about 10% of all species on Earth. Mount Everest (8,849 m) is the highest mountain. The Pacific Ocean is the largest ocean, covering more area than all land combined. The Sahara is the world\'s largest hot desert (about the size of the United States!).',
    ],
  },
  sphe: {
    feelings: [
      'Feelings (or emotions) are how we respond emotionally to things that happen in our lives. Every human being experiences a wide range of feelings — and they are all normal and valid.',
      'Common feelings include: happy, sad, excited, anxious (worried), angry, jealous, proud, embarrassed, lonely, calm and frustrated. Feelings can be strong or mild, and they can change quickly.',
      'It is important to recognise and name your feelings. Studies show that simply naming an emotion ("I feel anxious") helps reduce its intensity — sometimes called "name it to tame it."',
      'Healthy ways to manage difficult feelings: take slow, deep breaths (activates the calming part of your brain); talk to a trusted person about how you feel; draw or write about your feelings; exercise or go outside; do something creative like music or art.',
    ],
    friendships: [
      'Friendship is one of the most important things in life. Good friends make us happier, healthier and more resilient — they are there for us in both good times and bad.',
      'The qualities of a good friend: kindness, loyalty (sticking by someone), honesty (telling the truth, even when it is hard), respect (treating others the way you would want to be treated), empathy (understanding how others feel) and reliability (being someone others can count on).',
      'Friendships take effort to maintain. Saying hello, remembering important things about your friends, being a good listener, sharing and including others — these small actions make a big difference.',
      'Friendships can sometimes be difficult — disagreements happen even between the best of friends. When this happens: listen to each other, try to understand the other person\'s point of view, say sorry if you were wrong, and forgive. Working through difficulties often makes a friendship stronger.',
    ],
    bullying: [
      'Bullying is when someone repeatedly says or does something hurtful to another person who finds it hard to defend themselves. It is never okay, and it is never the victim\'s fault.',
      'Types of bullying: physical (hitting, pushing, taking belongings), verbal (name-calling, teasing, threats), social/relational (leaving someone out, spreading rumours, ignoring), and cyberbullying (using technology — texts, social media, gaming — to harass someone).',
      'If you are being bullied: tell a trusted adult (parent, teacher, school counsellor) straight away — you should never have to deal with this alone. Keep a record of what happened. Do not retaliate (fight back) as this can make things worse.',
      'If you see someone being bullied: do not join in or laugh, as this encourages the bully. Check on the person being bullied and show them kindness. Tell a trusted adult. Being an upstander (someone who speaks up) rather than a bystander (someone who watches) makes a real difference.',
    ],
    safety: [
      'Personal safety means knowing how to protect yourself from harm in different situations — at home, at school, online and when you are out and about.',
      'Your body belongs to you. Nobody has the right to touch you in a way that makes you feel uncomfortable. If this ever happens, always tell a trusted adult — it is never your fault and you will always be believed.',
      'Online safety rules: never share your full name, address, school name, phone number or passwords with anyone online. Be careful about photos you share. If anything online makes you feel uncomfortable, leave that page and tell a trusted adult straight away.',
      'Emergency services: in Ireland, you can call 999 or 112 in any emergency — for Garda (police), Ambulance, or Fire Brigade. Know your own address so you can give it to the operator. Only call in a real emergency.',
    ],
  },
  ethics: {
    default: [
      'Ethical education helps us think carefully about right and wrong, fairness, responsibility and what it means to be a good person in the world.',
      'Ethics is not just about following rules — it is about understanding WHY certain things are right or wrong, and developing the wisdom to make good choices even in difficult situations.',
      'Key ethical concepts: fairness (treating everyone equally and according to their needs), honesty (telling the truth and being genuine), respect (valuing every person\'s dignity, regardless of who they are), responsibility (being accountable for your own actions and their effects on others), compassion (caring about the suffering of others and wanting to help).',
      'Ethics also involves thinking about the environment, animals and future generations — not just the people around us right now. What kind of world do we want to live in, and what can each of us do to help create it?',
    ],
  },
  coding: {
    sequences: [
      'A sequence is an ordered set of instructions that are followed one after another in a specific order. The order matters — changing the sequence changes the result!',
      'Everything a computer does is based on sequences of instructions called programs or code. The computer follows each instruction exactly, in the order given. If the instructions are in the wrong order, the program will not work correctly.',
      'Example: to make a cup of tea, the sequence might be: (1) boil the kettle, (2) put a teabag in the cup, (3) pour boiling water into the cup, (4) wait 2 minutes, (5) remove the teabag, (6) add milk and sugar. If you pour the water before boiling it, the tea will not work!',
      'In coding, we write sequences using a programming language. Languages like Scratch (blocks), Python, JavaScript and HTML all have their own way of writing instructions, but they all follow the same idea: instructions are executed in order.',
    ],
    loops: [
      'A loop is a way of repeating a set of instructions a certain number of times (or until a condition is met) without having to write the same code over and over again.',
      'Imagine you want a character to walk forward 10 steps. Without a loop, you would have to write "move forward 1 step" ten times. With a loop, you write "repeat 10 times: move forward 1 step" — much more efficient!',
      'Types of loops: a "count-controlled loop" (or FOR loop) repeats a set number of times — "repeat 5 times". A "condition-controlled loop" (or WHILE loop) keeps repeating until a condition becomes true or false — "while score < 10, keep playing".',
      'In Scratch, you can use the "repeat" block (count-controlled) or "repeat until" (condition-controlled). Loops are one of the most powerful and commonly used tools in all of programming.',
    ],
    algorithms: [
      'An algorithm is a step-by-step set of instructions for solving a problem or completing a task. Every program and app on every device is built on algorithms.',
      'A good algorithm must be: clear (each step is unambiguous), correct (it solves the problem accurately), efficient (it solves the problem without wasting time or steps), and finite (it ends at some point — it does not run forever).',
      'Algorithms are not just for computers — they are used in everyday life too. A recipe is an algorithm for cooking a meal. A bus route is an algorithm for getting from A to B. Tying your shoelaces is an algorithm!',
      'Famous algorithms include: Google\'s search algorithm (sorts billions of web pages by relevance in milliseconds), GPS navigation algorithms (finds the fastest route), and sorting algorithms (e.g. the way a computer arranges names in alphabetical order).',
    ],
    debugging: [
      'Debugging is the process of finding and fixing errors (called bugs) in a computer program. Every programmer — from beginners to the world\'s best — encounters bugs. Debugging is a core part of coding!',
      'The word "bug" has an interesting history: in 1947, a real moth got stuck in a computer at Harvard University and caused it to malfunction. The engineers taped the moth into their logbook and wrote "First actual case of bug being found." The term stuck!',
      'Types of bugs: syntax errors (the code is not written in the correct format — like a spelling mistake in the programming language), logic errors (the code runs but gives the wrong answer — the algorithm has a flaw), and runtime errors (the code crashes while it is running — often caused by dividing by zero or using a variable that does not exist).',
      'Debugging strategies: read your code carefully, one line at a time; add print statements to see what your variables contain at each step; test with simple examples; ask someone else to look at your code with fresh eyes — a new perspective often spots the problem immediately!',
    ],
    'computing-basics': [
      'A computer is an electronic device that processes information (data) according to a set of instructions (a program). Computers have transformed almost every aspect of modern life.',
      'Every computer has hardware (the physical parts you can touch) and software (the programs and data). Key hardware: CPU (Central Processing Unit — the "brain" that processes instructions), RAM (Random Access Memory — temporary storage for programs currently running), storage (hard drive or SSD — permanent storage for files), input devices (keyboard, mouse, touchscreen), output devices (screen, printer, speakers).',
      'The internet is a global network of millions of computers connected together. The World Wide Web (www) is a collection of websites and pages that sit on top of the internet. The internet was invented in the 1960s; the World Wide Web was created by Tim Berners-Lee in 1989.',
      'Binary is the language computers use internally — everything is stored as a pattern of 0s and 1s (called bits). A group of 8 bits is called a byte. Your name, photos and music are all stored as billions of tiny 0s and 1s inside the computer!',
    ],
  },
}

export { INTROS }

export function getTopicIntro(subject, topic) {
  const subjectIntros = INTROS[subject]
  if (!subjectIntros) return [`Let's explore ${topic.replace(/-/g, ' ')} — a brand new topic!`]
  const intro = subjectIntros[topic] ?? subjectIntros.default
  if (!intro) return [`Let's explore ${topic.replace(/-/g, ' ')} — a fascinating new topic in 3rd class!`]
  // Support both old string format and new array format
  return Array.isArray(intro) ? intro : [intro]
}
