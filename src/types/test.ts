export type QuestionType = 'mcq' | 'short-answer' | 'long-answer' | 'essay' | 'true-false' | 'fill-blanks'

export interface Question {
  id: string
  questionText: string
  options: string[]
  correctAnswer: string
  explanation?: string
  marks: number
  difficulty: 'easy' | 'medium' | 'hard'
  topic?: string
  questionType: QuestionType
  cacheKey?: string
  timesReused: number
  testId: string
  createdAt: Date
  updatedAt: Date
}

export interface TestConfig {
  subjectCode: string
  subjectName: string
  subjectLevel: string
  numberOfQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  questionTypes: QuestionType[]
  duration: number // in minutes
}

export interface GeneratedTest {
  id: string
  title: string
  description?: string
  type: string
  difficulty: string
  duration: number
  totalMarks: number
  isAIGenerated: boolean
  topics?: string[]
  questionTypes?: QuestionType[]
  subjectId: string
  userId: string
  questions: Question[]
  createdAt: Date
  updatedAt: Date
}

export interface TestGenerationRequest {
  subjectCode: string
  subjectName: string
  subjectLevel: string
  numberOfQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  questionTypes: QuestionType[]
  duration?: number
}

export interface TestGenerationResponse {
  success: boolean
  test?: GeneratedTest
  error?: string
}

// Common topics for different subjects
export const SUBJECT_TOPICS: Record<string, string[]> = {
  // O-Level Mathematics
  '4024': [
    'Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Probability',
    'Functions', 'Graphs', 'Sequences', 'Transformations', 'Coordinate Geometry',
    'Number Theory', 'Ratio and Proportion', 'Percentage', 'Time and Distance',
    'Area and Perimeter', 'Volume and Surface Area', 'Angles and Triangles',
    'Circles', 'Quadratic Equations', 'Linear Equations', 'Inequalities',
    'Matrices', 'Vectors', 'Logarithms', 'Indices'
  ],
  // O-Level Additional Mathematics
  '4037': [
    'Advanced Algebra', 'Complex Numbers', 'Matrices', 'Vectors', 'Sequences and Series',
    'Binomial Theorem', 'Partial Fractions', 'Trigonometric Functions', 'Trigonometric Identities',
    'Differentiation', 'Integration', 'Coordinate Geometry', 'Circles', 'Parametric Equations',
    'Linear Programming', 'Permutations and Combinations', 'Probability Distributions',
    'Normal Distribution', 'Correlation and Regression', 'Hypothesis Testing'
  ],
  // O-Level Physics
  '5054': [
    'Mechanics', 'Thermodynamics', 'Waves', 'Electricity', 'Magnetism',
    'Light', 'Sound', 'Atomic Physics', 'Energy', 'Forces', 'Motion',
    'Newton\'s Laws', 'Work and Energy', 'Power', 'Pressure', 'Fluid Mechanics',
    'Heat Transfer', 'Kinetic Theory', 'Radioactivity', 'Nuclear Physics',
    'Optics', 'Reflection and Refraction', 'Lenses', 'Electromagnetic Spectrum'
  ],
  // O-Level Chemistry
  '5070': [
    'Atomic Structure', 'Chemical Bonding', 'Stoichiometry', 'Acids and Bases',
    'Electrochemistry', 'Organic Chemistry', 'Periodic Table', 'Chemical Reactions',
    'States of Matter', 'Kinetic Theory', 'Solutions', 'Colloids', 'Chemical Kinetics',
    'Chemical Equilibrium', 'Redox Reactions', 'Electrolysis', 'Metals and Non-metals',
    'Hydrocarbons', 'Functional Groups', 'Polymers', 'Biochemistry'
  ],
  // O-Level Biology
  '5090': [
    'Cell Biology', 'Genetics', 'Ecology', 'Human Biology', 'Plant Biology',
    'Evolution', 'Biochemistry', 'Reproduction', 'Digestive System', 'Nervous System',
    'Circulatory System', 'Respiratory System', 'Excretory System', 'Endocrine System',
    'Immune System', 'Muscular System', 'Skeletal System', 'Photosynthesis',
    'Respiration', 'Nutrition', 'Transport in Plants', 'Plant Reproduction',
    'Classification', 'Biodiversity', 'Conservation'
  ],
  // O-Level English Language
  '1123': [
    'Reading Comprehension', 'Writing Skills', 'Grammar', 'Vocabulary',
    'Essay Writing', 'Summary Writing', 'Letter Writing', 'Report Writing',
    'Creative Writing', 'Descriptive Writing', 'Narrative Writing', 'Argumentative Writing',
    'Persuasive Writing', 'Technical Writing', 'Proofreading', 'Editing',
    'Sentence Structure', 'Paragraph Development', 'Cohesion and Coherence',
    'Punctuation', 'Spelling', 'Style and Tone', 'Literary Devices'
  ],
  // O-Level English Literature
  '2010': [
    'Poetry Analysis', 'Prose Analysis', 'Drama Analysis', 'Literary Devices',
    'Character Analysis', 'Theme Analysis', 'Setting Analysis', 'Plot Analysis',
    'Symbolism', 'Metaphor', 'Imagery', 'Tone and Mood', 'Point of View',
    'Narrative Techniques', 'Historical Context', 'Cultural Context',
    'Critical Analysis', 'Comparative Analysis', 'Literary Criticism',
    'Author\'s Style', 'Literary Movements', 'Genre Studies'
  ],
  // O-Level Urdu
  '3248': [
    'اردو گرامر', 'اردو ادب', 'شاعری', 'نثر', 'ڈراما', 'مضمون نویسی',
    'خط نویسی', 'خلاصہ نویسی', 'ترجمہ', 'اردو صرف و نحو', 'اردو زبان کی تاریخ',
    'اردو شاعری کی روایت', 'اردو نثر کی روایت', 'اردو ادب کی تنقید',
    'اردو زبان کا استعمال', 'اردو رسم الخط', 'اردو املا'
  ],
  // O-Level Pakistan Studies
  '2059': [
    'Pakistan Movement', 'Independence Struggle', 'Founding Fathers', 'Constitutional Development',
    'Political System', 'Economic Development', 'Social Issues', 'Cultural Heritage',
    'Geographical Features', 'Climate', 'Natural Resources', 'Agriculture',
    'Industry', 'Trade', 'Transportation', 'Communication', 'Population',
    'Urban Development', 'Environmental Issues', 'International Relations'
  ],
  // O-Level Islamiyat
  '2058': [
    'Quranic Studies', 'Hadith Studies', 'Islamic History', 'Prophet Muhammad (PBUH)',
    'Companions of Prophet', 'Islamic Civilization', 'Islamic Jurisprudence',
    'Islamic Beliefs', 'Five Pillars of Islam', 'Islamic Ethics', 'Islamic Social System',
    'Islamic Economic System', 'Islamic Political System', 'Contemporary Issues',
    'Islamic Culture', 'Islamic Art and Architecture', 'Islamic Literature'
  ],
  // O-Level Computer Science
  '2210': [
    'Programming Concepts', 'Data Types', 'Variables', 'Control Structures',
    'Functions', 'Arrays', 'Strings', 'File Handling', 'Algorithms', 'Data Structures',
    'Computer Hardware', 'Computer Software', 'Operating Systems', 'Networks',
    'Database Concepts', 'Web Development', 'Cybersecurity', 'Ethics in Computing',
    'Problem Solving', 'System Analysis', 'System Design'
  ],
  // O-Level Geography
  '2217': [
    'Physical Geography', 'Human Geography', 'Map Reading', 'Weather and Climate',
    'Rivers and Water', 'Mountains and Plateaus', 'Coastal Features', 'Deserts',
    'Forests', 'Agriculture', 'Industry', 'Population', 'Urbanization',
    'Transportation', 'Trade', 'Environmental Issues', 'Natural Hazards',
    'Regional Geography', 'Economic Geography', 'Political Geography'
  ],
  // O-Level History
  '2147': [
    'Ancient Civilizations', 'Medieval Period', 'Renaissance', 'Industrial Revolution',
    'World Wars', 'Colonialism', 'Independence Movements', 'Revolutionary Periods',
    'Political Developments', 'Economic Changes', 'Social Movements', 'Cultural Changes',
    'Technological Advances', 'Historical Sources', 'Historical Analysis',
    'Chronology', 'Cause and Effect', 'Historical Interpretation'
  ],
  // O-Level Economics
  '2281': [
    'Basic Economic Concepts', 'Supply and Demand', 'Market Systems', 'Price Mechanism',
    'Production', 'Costs', 'Revenue', 'Profit', 'Competition', 'Monopoly',
    'Government Intervention', 'Public Finance', 'Money and Banking', 'Inflation',
    'Unemployment', 'Economic Growth', 'Development', 'International Trade',
    'Exchange Rates', 'Economic Policies'
  ],
  // O-Level Accounting
  '7707': [
    'Basic Accounting Concepts', 'Double Entry System', 'Trial Balance', 'Financial Statements',
    'Balance Sheet', 'Income Statement', 'Cash Flow Statement', 'Adjusting Entries',
    'Closing Entries', 'Partnership Accounting', 'Company Accounting', 'Ratio Analysis',
    'Budgeting', 'Cost Accounting', 'Management Accounting', 'Auditing',
    'Taxation', 'Accounting Standards', 'Ethics in Accounting'
  ],
  // O-Level Business Studies
  '7115': [
    'Business Environment', 'Types of Business', 'Business Objectives', 'Stakeholders',
    'Marketing', 'Production', 'Human Resources', 'Finance', 'Business Planning',
    'Entrepreneurship', 'International Business', 'Business Ethics', 'Social Responsibility',
    'Technology in Business', 'Globalization', 'Business Communication',
    'Leadership', 'Management', 'Organizational Structure'
  ],
  // O-Level Sociology
  '2251': [
    'Social Structure', 'Social Institutions', 'Socialization', 'Culture',
    'Social Groups', 'Social Stratification', 'Social Mobility', 'Social Change',
    'Social Problems', 'Family', 'Education', 'Religion', 'Politics',
    'Economy', 'Deviance', 'Social Control', 'Social Research', 'Social Theory'
  ],
  // O-Level French
  '3015': [
    'Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills',
    'Listening Skills', 'Speaking Skills', 'French Culture', 'French Literature',
    'French History', 'French Geography', 'French Society', 'French Traditions',
    'French Cuisine', 'French Art', 'French Music', 'French Cinema',
    'French Language Usage', 'French Idioms', 'French Pronunciation'
  ],
  // O-Level German
  '3016': [
    'Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills',
    'Listening Skills', 'Speaking Skills', 'German Culture', 'German Literature',
    'German History', 'German Geography', 'German Society', 'German Traditions',
    'German Cuisine', 'German Art', 'German Music', 'German Cinema',
    'German Language Usage', 'German Idioms', 'German Pronunciation'
  ],
  // O-Level Spanish
  '3017': [
    'Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills',
    'Listening Skills', 'Speaking Skills', 'Spanish Culture', 'Spanish Literature',
    'Spanish History', 'Spanish Geography', 'Spanish Society', 'Spanish Traditions',
    'Spanish Cuisine', 'Spanish Art', 'Spanish Music', 'Spanish Cinema',
    'Spanish Language Usage', 'Spanish Idioms', 'Spanish Pronunciation'
  ],
  // O-Level Arabic
  '3180': [
    'Arabic Grammar', 'Arabic Vocabulary', 'Reading Comprehension', 'Writing Skills',
    'Arabic Literature', 'Arabic Poetry', 'Arabic Prose', 'Islamic Texts',
    'Arabic Calligraphy', 'Arabic Culture', 'Arabic History', 'Arabic Geography',
    'Arabic Society', 'Arabic Traditions', 'Classical Arabic', 'Modern Arabic'
  ],
  // O-Level Chinese
  '3205': [
    'Chinese Characters', 'Chinese Grammar', 'Chinese Vocabulary', 'Reading Comprehension',
    'Writing Skills', 'Chinese Culture', 'Chinese Literature', 'Chinese History',
    'Chinese Geography', 'Chinese Society', 'Chinese Traditions', 'Chinese Philosophy',
    'Chinese Art', 'Chinese Music', 'Chinese Calligraphy', 'Chinese Cuisine'
  ],
  // O-Level Art & Design
  '6090': [
    'Drawing Techniques', 'Painting', 'Sculpture', 'Printmaking', 'Digital Art',
    'Color Theory', 'Composition', 'Perspective', 'Art History', 'Art Movements',
    'Art Criticism', 'Art Analysis', 'Creative Process', 'Art Materials',
    'Art Techniques', 'Art Styles', 'Contemporary Art', 'Art Appreciation'
  ],
  // O-Level Music
  '6100': [
    'Music Theory', 'Musical Notation', 'Rhythm', 'Melody', 'Harmony',
    'Musical Instruments', 'Music History', 'Music Genres', 'Composition',
    'Performance', 'Music Analysis', 'Music Appreciation', 'Musical Forms',
    'Music Technology', 'Music Production', 'Music Education', 'Music Therapy'
  ],
  // O-Level Drama
  '6421': [
    'Acting Techniques', 'Stage Performance', 'Voice and Speech', 'Movement',
    'Character Development', 'Script Analysis', 'Theatre History', 'Drama Genres',
    'Stage Design', 'Lighting', 'Costume Design', 'Directing', 'Playwriting',
    'Theatre Production', 'Theatre Criticism', 'Theatre Appreciation'
  ],
  // O-Level Food & Nutrition
  '6065': [
    'Nutritional Science', 'Food Groups', 'Balanced Diet', 'Food Preparation',
    'Cooking Methods', 'Food Safety', 'Food Preservation', 'Food Technology',
    'Meal Planning', 'Special Diets', 'Food Allergies', 'Food Labelling',
    'Food Marketing', 'Food Trends', 'Food Culture', 'Food Ethics'
  ],
  // O-Level Design & Technology
  '6043': [
    'Design Process', 'Design Thinking', 'Materials', 'Manufacturing Processes',
    'Product Design', 'System Design', 'Graphic Design', 'Industrial Design',
    'Design Analysis', 'Design Evaluation', 'Design Communication', 'Design Technology',
    'Design History', 'Design Movements', 'Sustainable Design', 'Design Innovation'
  ],
  // O-Level Physical Education
  '5016': [
    'Sports Science', 'Exercise Physiology', 'Sports Psychology', 'Training Methods',
    'Sports Nutrition', 'Injury Prevention', 'Sports Medicine', 'Sports Technology',
    'Sports Management', 'Sports Ethics', 'Team Sports', 'Individual Sports',
    'Fitness Assessment', 'Physical Fitness', 'Sports Performance', 'Sports Coaching'
  ],
  // O-Level Travel & Tourism
  '7096': [
    'Tourism Industry', 'Travel Planning', 'Destination Management', 'Hospitality',
    'Tourism Marketing', 'Tourism Economics', 'Tourism Geography', 'Tourism History',
    'Tourism Technology', 'Tourism Policy', 'Sustainable Tourism', 'Cultural Tourism',
    'Ecotourism', 'Adventure Tourism', 'Tourism Services', 'Tourism Impact'
  ],
  // O-Level Environmental Management
  '5014': [
    'Environmental Science', 'Ecosystems', 'Biodiversity', 'Climate Change',
    'Pollution', 'Waste Management', 'Renewable Energy', 'Sustainable Development',
    'Environmental Policy', 'Environmental Law', 'Environmental Ethics', 'Conservation',
    'Environmental Impact Assessment', 'Environmental Technology', 'Environmental Education'
  ],

  // A-Level Mathematics
  '9709': [
    'Calculus', 'Algebra', 'Trigonometry', 'Statistics', 'Probability',
    'Vectors', 'Complex Numbers', 'Differential Equations', 'Integration',
    'Sequences and Series', 'Binomial Theorem', 'Matrices', 'Linear Algebra',
    'Functions', 'Graphs', 'Coordinate Geometry', 'Parametric Equations',
    'Polar Coordinates', 'Hyperbolic Functions', 'Numerical Methods'
  ],
  // A-Level Further Mathematics
  '9231': [
    'Advanced Calculus', 'Multivariable Calculus', 'Vector Calculus', 'Complex Analysis',
    'Group Theory', 'Ring Theory', 'Linear Algebra', 'Abstract Algebra',
    'Number Theory', 'Combinatorics', 'Graph Theory', 'Discrete Mathematics',
    'Differential Geometry', 'Topology', 'Mathematical Logic', 'Set Theory'
  ],
  // A-Level Physics
  '9702': [
    'Mechanics', 'Thermodynamics', 'Waves', 'Electricity', 'Magnetism',
    'Quantum Physics', 'Nuclear Physics', 'Optics', 'Modern Physics',
    'Relativity', 'Particle Physics', 'Astrophysics', 'Fluid Mechanics',
    'Statistical Mechanics', 'Solid State Physics', 'Plasma Physics',
    'Medical Physics', 'Engineering Physics', 'Theoretical Physics'
  ],
  // A-Level Chemistry
  '9701': [
    'Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry',
    'Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Kinetics',
    'Equilibrium', 'Electrochemistry', 'Spectroscopy', 'Chromatography',
    'Polymer Chemistry', 'Biochemistry', 'Medicinal Chemistry', 'Environmental Chemistry',
    'Analytical Chemistry', 'Industrial Chemistry', 'Green Chemistry'
  ],
  // A-Level Biology
  '9700': [
    'Molecular Biology', 'Genetics', 'Ecology', 'Human Biology',
    'Cell Biology', 'Biochemistry', 'Evolution', 'Physiology',
    'Microbiology', 'Immunology', 'Neuroscience', 'Endocrinology',
    'Developmental Biology', 'Plant Biology', 'Animal Biology', 'Marine Biology',
    'Conservation Biology', 'Biotechnology', 'Bioinformatics'
  ],
  // A-Level Computer Science
  '9608': [
    'Programming', 'Data Structures', 'Algorithms', 'Computer Systems',
    'Networks', 'Databases', 'Software Engineering', 'Operating Systems',
    'Computer Architecture', 'Artificial Intelligence', 'Machine Learning',
    'Computer Graphics', 'Human-Computer Interaction', 'Cybersecurity',
    'Web Development', 'Mobile Development', 'Game Development', 'System Analysis'
  ],
  // A-Level Environmental Science
  '9693': [
    'Environmental Systems', 'Ecosystem Dynamics', 'Biodiversity', 'Climate Systems',
    'Environmental Chemistry', 'Environmental Physics', 'Environmental Biology',
    'Environmental Geology', 'Environmental Policy', 'Environmental Economics',
    'Environmental Law', 'Environmental Ethics', 'Sustainable Development',
    'Environmental Technology', 'Environmental Management', 'Environmental Assessment'
  ],
  // A-Level Psychology
  '9990': [
    'Cognitive Psychology', 'Developmental Psychology', 'Social Psychology',
    'Biological Psychology', 'Abnormal Psychology', 'Personality Psychology',
    'Research Methods', 'Statistics', 'Experimental Design', 'Case Studies',
    'Psychological Testing', 'Therapy', 'Counseling', 'Health Psychology',
    'Educational Psychology', 'Industrial Psychology', 'Forensic Psychology'
  ],
  // A-Level English Language
  '9093': [
    'Language Analysis', 'Language Acquisition', 'Language Change', 'Language Varieties',
    'Discourse Analysis', 'Pragmatics', 'Semantics', 'Phonetics', 'Phonology',
    'Morphology', 'Syntax', 'Sociolinguistics', 'Psycholinguistics', 'Historical Linguistics',
    'Applied Linguistics', 'Language Teaching', 'Language Learning', 'Language Policy'
  ],
  // A-Level English Literature
  '9695': [
    'Literary Theory', 'Critical Analysis', 'Genre Studies', 'Period Studies',
    'Comparative Literature', 'World Literature', 'Postcolonial Literature',
    'Feminist Literature', 'Modern Literature', 'Contemporary Literature',
    'Poetry Analysis', 'Prose Analysis', 'Drama Analysis', 'Literary Criticism',
    'Literary History', 'Cultural Studies', 'Textual Analysis', 'Creative Writing'
  ],
  // A-Level Pakistan Studies
  '9488': [
    'Pakistan Movement', 'Independence Struggle', 'Constitutional History', 'Political Development',
    'Economic Development', 'Social Development', 'Cultural Heritage', 'Foreign Policy',
    'International Relations', 'Regional Studies', 'Contemporary Issues', 'Historical Analysis',
    'Political Analysis', 'Economic Analysis', 'Social Analysis', 'Cultural Analysis'
  ],
  // A-Level Geography
  '9696': [
    'Physical Geography', 'Human Geography', 'Geographic Information Systems',
    'Remote Sensing', 'Geomorphology', 'Climatology', 'Biogeography', 'Hydrology',
    'Urban Geography', 'Economic Geography', 'Political Geography', 'Cultural Geography',
    'Environmental Geography', 'Regional Geography', 'Global Geography', 'Geographic Research'
  ],
  // A-Level History
  '9489': [
    'Historical Methodology', 'Historical Sources', 'Historical Analysis', 'Historical Interpretation',
    'Political History', 'Economic History', 'Social History', 'Cultural History',
    'Intellectual History', 'Military History', 'Diplomatic History', 'Colonial History',
    'Revolutionary History', 'Comparative History', 'World History', 'Regional History'
  ],
  // A-Level Economics
  '9708': [
    'Microeconomics', 'Macroeconomics', 'International Economics', 'Development Economics',
    'Labor Economics', 'Public Economics', 'Environmental Economics', 'Behavioral Economics',
    'Economic History', 'Economic Policy', 'Economic Analysis', 'Economic Theory',
    'Mathematical Economics', 'Econometrics', 'Economic Statistics', 'Economic Systems'
  ],
  // A-Level Accounting
  '9706': [
    'Financial Accounting', 'Management Accounting', 'Cost Accounting', 'Auditing',
    'Taxation', 'Corporate Finance', 'Financial Analysis', 'Investment Analysis',
    'Risk Management', 'International Accounting', 'Accounting Standards', 'Accounting Theory',
    'Accounting Information Systems', 'Forensic Accounting', 'Public Sector Accounting'
  ],
  // A-Level Business Studies
  '9609': [
    'Strategic Management', 'Operations Management', 'Marketing Management', 'Human Resource Management',
    'Financial Management', 'International Business', 'Entrepreneurship', 'Business Ethics',
    'Corporate Governance', 'Business Law', 'Business Communication', 'Business Technology',
    'Business Innovation', 'Business Sustainability', 'Business Analysis', 'Business Strategy'
  ],
  // A-Level Sociology
  '9699': [
    'Sociological Theory', 'Research Methods', 'Social Structure', 'Social Institutions',
    'Social Change', 'Social Stratification', 'Social Mobility', 'Social Problems',
    'Social Policy', 'Social Work', 'Criminology', 'Medical Sociology', 'Urban Sociology',
    'Rural Sociology', 'Industrial Sociology', 'Political Sociology', 'Cultural Sociology'
  ],
  // A-Level Law
  '9084': [
    'Constitutional Law', 'Criminal Law', 'Contract Law', 'Tort Law', 'Property Law',
    'Family Law', 'Employment Law', 'Company Law', 'International Law', 'Human Rights Law',
    'Environmental Law', 'Commercial Law', 'Administrative Law', 'Legal Theory',
    'Legal Systems', 'Legal Practice', 'Legal Ethics', 'Jurisprudence'
  ],
  // A-Level Political Science
  '9698': [
    'Political Theory', 'Comparative Politics', 'International Relations', 'Political Economy',
    'Public Administration', 'Political Sociology', 'Political Psychology', 'Political Communication',
    'Political Philosophy', 'Political Systems', 'Political Institutions', 'Political Behavior',
    'Political Development', 'Political Change', 'Political Analysis', 'Political Research'
  ],
  // A-Level Philosophy
  '9704': [
    'Ethics', 'Metaphysics', 'Epistemology', 'Logic', 'Political Philosophy',
    'Philosophy of Mind', 'Philosophy of Science', 'Philosophy of Religion',
    'Aesthetics', 'Philosophy of Language', 'Social Philosophy', 'Environmental Philosophy',
    'Philosophical Methods', 'Critical Thinking', 'Philosophical Analysis', 'Philosophical History'
  ],
  // A-Level French
  '9716': [
    'Advanced Grammar', 'Advanced Vocabulary', 'Literature Analysis', 'Cultural Studies',
    'Linguistic Analysis', 'Translation', 'Creative Writing', 'Critical Analysis',
    'French Civilization', 'French Art', 'French Cinema', 'French Society',
    'French Politics', 'French Economy', 'French Media', 'French Technology'
  ],
  // A-Level German
  '9717': [
    'Advanced Grammar', 'Advanced Vocabulary', 'Literature Analysis', 'Cultural Studies',
    'Linguistic Analysis', 'Translation', 'Creative Writing', 'Critical Analysis',
    'German Civilization', 'German Art', 'German Cinema', 'German Society',
    'German Politics', 'German Economy', 'German Media', 'German Technology'
  ],
  // A-Level Spanish
  '9719': [
    'Advanced Grammar', 'Advanced Vocabulary', 'Literature Analysis', 'Cultural Studies',
    'Linguistic Analysis', 'Translation', 'Creative Writing', 'Critical Analysis',
    'Spanish Civilization', 'Spanish Art', 'Spanish Cinema', 'Spanish Society',
    'Spanish Politics', 'Spanish Economy', 'Spanish Media', 'Spanish Technology'
  ],
  // A-Level Arabic
  '9680': [
    'Advanced Grammar', 'Advanced Vocabulary', 'Literature Analysis', 'Cultural Studies',
    'Classical Arabic', 'Modern Arabic', 'Arabic Linguistics', 'Arabic Literature',
    'Arabic Poetry', 'Arabic Prose', 'Islamic Texts', 'Arabic Calligraphy',
    'Arabic Civilization', 'Arabic Society', 'Arabic Media', 'Arabic Technology'
  ],
  // A-Level Chinese
  '9715': [
    'Advanced Characters', 'Advanced Grammar', 'Literature Analysis', 'Cultural Studies',
    'Classical Chinese', 'Modern Chinese', 'Chinese Linguistics', 'Chinese Literature',
    'Chinese Poetry', 'Chinese Prose', 'Chinese Philosophy', 'Chinese Calligraphy',
    'Chinese Civilization', 'Chinese Society', 'Chinese Media', 'Chinese Technology'
  ],
  // A-Level Urdu
  '9686': [
    'اردو ادب کی تنقید', 'اردو شاعری', 'اردو نثر', 'اردو ڈراما', 'اردو زبان کا استعمال',
    'اردو رسم الخط', 'اردو املا', 'اردو صرف و نحو', 'اردو زبان کی تاریخ',
    'اردو شاعری کی روایت', 'اردو نثر کی روایت', 'اردو ادب کی تاریخ',
    'اردو زبان کی ترقی', 'اردو ادب کی تحریکیں', 'اردو ادب کا مطالعہ'
  ],
  // A-Level Art & Design
  '9479': [
    'Advanced Drawing', 'Advanced Painting', 'Advanced Sculpture', 'Advanced Printmaking',
    'Digital Art', 'Installation Art', 'Performance Art', 'Conceptual Art',
    'Art Theory', 'Art Criticism', 'Art History', 'Contemporary Art', 'Modern Art',
    'Art Movements', 'Art Analysis', 'Art Appreciation', 'Art Research'
  ],
  // A-Level Music
  '9483': [
    'Advanced Music Theory', 'Advanced Composition', 'Advanced Performance', 'Music Analysis',
    'Music History', 'Music Technology', 'Music Production', 'Music Education',
    'Music Psychology', 'Music Sociology', 'Music Philosophy', 'Music Aesthetics',
    'Music Research', 'Music Criticism', 'Music Appreciation', 'Music Therapy'
  ],
  // A-Level Drama and Theatre Studies
  '9482': [
    'Advanced Acting', 'Advanced Directing', 'Advanced Design', 'Theatre History',
    'Theatre Theory', 'Theatre Criticism', 'Performance Analysis', 'Theatre Production',
    'Theatre Technology', 'Theatre Management', 'Theatre Education', 'Theatre Research',
    'Theatre Appreciation', 'Theatre Innovation', 'Theatre Collaboration', 'Theatre Analysis'
  ],
  // A-Level Photography
  '9486': [
    'Advanced Photography', 'Digital Photography', 'Film Photography', 'Photographic Techniques',
    'Photographic Composition', 'Photographic Lighting', 'Photographic Processing',
    'Photographic History', 'Photographic Theory', 'Photographic Criticism',
    'Photographic Analysis', 'Photographic Appreciation', 'Photographic Research',
    'Photographic Technology', 'Photographic Innovation', 'Photographic Expression'
  ],
  // A-Level Media Studies
  '9607': [
    'Media Analysis', 'Media Theory', 'Media Production', 'Media Technology',
    'Media History', 'Media Criticism', 'Media Research', 'Media Effects',
    'Media Representation', 'Media Industries', 'Media Audiences', 'Media Regulation',
    'Media Globalization', 'Media Convergence', 'Media Innovation', 'Media Ethics'
  ],
  // A-Level Information Technology
  '9626': [
    'Advanced Programming', 'Advanced Databases', 'Advanced Networks', 'Advanced Systems',
    'Software Engineering', 'System Analysis', 'System Design', 'Project Management',
    'IT Strategy', 'IT Security', 'IT Ethics', 'IT Innovation', 'IT Research',
    'IT Development', 'IT Implementation', 'IT Management'
  ],
  // A-Level Design and Technology
  '9705': [
    'Advanced Design', 'Advanced Materials', 'Advanced Manufacturing', 'Advanced Systems',
    'Product Innovation', 'Design Analysis', 'Design Evaluation', 'Design Communication',
    'Design Research', 'Design Development', 'Design Implementation', 'Design Management',
    'Design Technology', 'Design Innovation', 'Design Sustainability', 'Design Ethics'
  ],
  // A-Level Physical Education
  '9396': [
    'Advanced Sports Science', 'Advanced Exercise Physiology', 'Advanced Sports Psychology',
    'Advanced Training Methods', 'Advanced Sports Medicine', 'Advanced Sports Technology',
    'Advanced Sports Management', 'Advanced Sports Analysis', 'Advanced Sports Research',
    'Advanced Sports Innovation', 'Advanced Sports Ethics', 'Advanced Sports Performance',
    'Advanced Sports Coaching', 'Advanced Sports Development', 'Advanced Sports Assessment'
  ],
  // A-Level Travel and Tourism
  '9395': [
    'Advanced Tourism Management', 'Advanced Tourism Marketing', 'Advanced Tourism Economics',
    'Advanced Tourism Geography', 'Advanced Tourism Policy', 'Advanced Tourism Technology',
    'Advanced Tourism Innovation', 'Advanced Tourism Research', 'Advanced Tourism Analysis',
    'Advanced Tourism Development', 'Advanced Tourism Planning', 'Advanced Tourism Impact',
    'Advanced Tourism Sustainability', 'Advanced Tourism Ethics', 'Advanced Tourism Strategy'
  ]
}

// Default topics for subjects not in the mapping
export const DEFAULT_TOPICS = [
  'Fundamentals', 'Core Concepts', 'Advanced Topics', 'Practical Applications',
  'Problem Solving', 'Theory', 'Analysis', 'Synthesis'
]

// Question type definitions with labels and descriptions
export const QUESTION_TYPES: Record<QuestionType, { label: string; description: string }> = {
  'mcq': { label: 'Multiple Choice (MCQs)', description: '4 options with one correct answer' },
  'short-answer': { label: 'Short Answer', description: 'Brief written responses (1-2 sentences)' },
  'long-answer': { label: 'Long Answer / Theory', description: 'Detailed explanations and descriptions' },
  'essay': { label: 'Essay', description: 'Extended writing for language/humanities subjects' },
  'true-false': { label: 'True/False', description: 'Binary choice questions' },
  'fill-blanks': { label: 'Fill in the Blanks', description: 'Complete the sentence questions' }
}

// Subject-appropriate question types
export const SUBJECT_QUESTION_TYPES: Record<string, QuestionType[]> = {
  // Math subjects - no essays, focus on MCQs and calculations
  '4024': ['mcq', 'short-answer', 'long-answer'],
  '4037': ['mcq', 'short-answer', 'long-answer'],
  '9709': ['mcq', 'short-answer', 'long-answer'],
  '9231': ['mcq', 'short-answer', 'long-answer'],
  
  // Science subjects - mix of all types except essays
  '5054': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '5070': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '5090': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9702': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9701': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9700': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  
  // Language subjects - all types including essays
  '1123': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '2010': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9093': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9695': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '3248': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '9686': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  
  // Humanities subjects - all types
  '2059': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '2058': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '2147': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9489': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '2217': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9696': ['mcq', 'short-answer', 'long-answer', 'essay'],
  
  // Social sciences - mix of types
  '2281': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9708': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '7707': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9706': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '7115': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9609': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '2251': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9699': ['mcq', 'short-answer', 'long-answer', 'essay'],
  
  // Technical subjects - mostly MCQs and practical questions
  '2210': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9608': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9626': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  
  // Creative subjects - all types
  '6090': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9479': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '6100': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9483': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '6421': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9482': ['mcq', 'short-answer', 'long-answer', 'essay'],
  
  // Applied subjects - mix of types
  '6065': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '6043': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9705': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '5016': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '9396': ['mcq', 'short-answer', 'long-answer', 'true-false'],
  '7096': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9395': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '5014': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9693': ['mcq', 'short-answer', 'long-answer', 'essay'],
  
  // Language subjects (foreign languages)
  '3015': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '3016': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '3017': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '3180': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '3205': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '9716': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '9717': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '9719': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '9680': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  '9715': ['mcq', 'short-answer', 'long-answer', 'essay', 'fill-blanks'],
  
  // Advanced subjects
  '9990': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9084': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9698': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9704': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9488': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9486': ['mcq', 'short-answer', 'long-answer', 'essay'],
  '9607': ['mcq', 'short-answer', 'long-answer', 'essay']
}

// Get appropriate question types for a subject
export function getQuestionTypesForSubject(subjectCode: string): QuestionType[] {
  return SUBJECT_QUESTION_TYPES[subjectCode] || ['mcq', 'short-answer', 'long-answer']
}
