import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { members } from '../../database/schema/members';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';
import { organizations } from '../../database/schema/organizations';
import { subjects } from '../../database/schema/subjects';
import { schoolClasses } from '../../database/schema/school-classes';
import { subjectsToSchoolClasses } from '../../database/schema/subjects-to-school-classes';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { studentsToSchoolClasses } from '../../database/schema/students-to-school-classes';
import { eq, sql } from 'drizzle-orm';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { posts } from '../../database/schema/posts';
import { grades } from '../../database/schema/grades';
import { absences } from '../../database/schema/absences';

function getRandomElement(arr: any[]) {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}

const materials = [
	{
		title: 'Lecție despre ecologie',
		body: 'Pe 12 octombrie, la ora 10:00, vom avea o lecție despre ecologia locală. Vă rugăm să aduceți notițele de la lecțiile anterioare și să fiți pregătiți pentru discuții despre impactul activităților umane asupra mediului.'
	},
	{
		title: 'Resurse pentru lecția de istorie',
		body: 'Pentru lecția de istorie din 15 octombrie, vă rugăm să consultați resursele online despre Revoluția Industrială. Linkurile și materialele suplimentare vor fi disponibile pe platforma de învățare a școlii.'
	},
	{
		title: 'Lecție de chimie - Experimente',
		body: 'Miercuri, 18 octombrie, vom realiza experimente de laborator la lecția de chimie. Asigurați-vă că aveți echipament de protecție (ochelari, mănuși) și că ați citit materialele de pregătire trimise prin e-mail.'
	},
	{
		title: 'Tema pentru lecția de literatură',
		body: "Pentru lecția de literatură din 22 octombrie, citiți capitolul despre 'Literatura modernă' din manualul de literatură. Vom discuta despre autorii principali și stilurile literare. Pregătiți întrebări și observații pentru dezbatere."
	},
	{
		title: 'Lecție de matematică - Probleme de geometrie',
		body: 'Pe 25 octombrie, vom aborda probleme de geometrie avansată la lecția de matematică. Vă rugăm să revizuiți lecțiile anterioare și să aduceți toate notițele și lucrările necesare pentru a putea participa activ.'
	}
];

const assignments = [
	{
		title: 'Tema pentru matematică',
		body: 'Pentru săptămâna aceasta, elevii din clasa a VII-a au de rezolvat exercițiile 15-30 din manualul de matematică. Tema trebuie predată până vineri la ora 12:00.'
	},
	{
		title: 'Eseu de literatură',
		body: "Clasa a IX-a are de scris un eseu pe tema 'Importanța lecturii în dezvoltarea personală'. Eseul trebuie să aibă între 500 și 700 de cuvinte și să fie predat până pe 18 octombrie."
	},
	{
		title: 'Proiect de istorie',
		body: "Elevii din clasa a XI-a sunt rugați să finalizeze proiectul despre 'Evenimentele cheie ale secolului XX'. Proiectul trebuie să fie prezentat în clasă pe 25 octombrie."
	},
	{
		title: 'Exerciții de gramatică',
		body: 'Pentru săptămâna aceasta, elevii din clasa a VI-a trebuie să rezolve paginile 42-45 din caietul de gramatică. Verificarea temei va avea loc marți.'
	},
	{
		title: 'Prezentare de științe',
		body: "Elevii din clasa a VIII-a au de pregătit o prezentare pe tema 'Ciclul apei în natură'. Prezentarea trebuie să fie finalizată și trimisă profesorului până pe 20 octombrie."
	}
];

const announcements = [
	{
		title: 'Începerea anului școlar',
		body: 'Dragi elevi, vă așteptăm cu drag la deschiderea noului an școlar pe data de 15 septembrie, ora 9:00. Ceremonia va avea loc în curtea școlii și va include un discurs al directorului, urmat de prezentarea noilor profesori și a planurilor pentru anul școlar în curs. Vă rugăm să veniți îmbrăcați în uniforma școlară și să aveți la voi rechizitele necesare pentru prima zi de școală.'
	},
	{
		title: 'Excursie educativă la muzeu',
		body: 'Clasa a VII-a va merge într-o excursie la Muzeul Național pe data de 20 octombrie. Vă rugăm să aduceți acordul părinților până la 15 octombrie. Excursia va include un tur ghidat al expozițiilor permanente și temporare, precum și activități interactive menite să îmbogățească cunoștințele elevilor despre istoria și cultura națională. Transportul și prânzul vor fi asigurate de școală.'
	},
	{
		title: 'Târg de carte școlară',
		body: 'Vă invităm la târgul de carte școlară care va avea loc în biblioteca școlii pe 25 septembrie. Vor fi disponibile cărți la prețuri reduse pentru toate nivelurile de studiu, de la clasele primare până la liceu. Târgul va include și prezentări ale unor autori locali, sesiuni de autografe și ateliere de lectură. Este o ocazie excelentă pentru elevi să-și completeze bibliotecile personale și să descopere noi titluri interesante.'
	},
	{
		title: 'Concurs de matematică',
		body: 'Concursul de matematică pentru clasele V-VIII va avea loc pe 10 noiembrie. Înscrierile se fac la profesorul de matematică până la 5 noiembrie. Concursul va consta dintr-o probă scrisă cu probleme de dificultate variată, menite să testeze atât cunoștințele teoretice cât și abilitățile practice ale elevilor. Cei mai buni participanți vor fi premiați cu diplome și premii surpriză.'
	},
	{
		title: 'Ziua porților deschise',
		body: 'Pe 30 septembrie, școala noastră organizează Ziua Porților Deschise. Părinții sunt invitați să participe la diverse activități alături de copii, inclusiv ateliere de lucru, prezentări ale proiectelor școlare și tururi ale campusului. Este o oportunitate excelentă pentru părinți să vadă cum se desfășoară activitățile educative și să interacționeze cu profesorii și conducerea școlii. Vă așteptăm cu drag!'
	},
	{
		title: 'Vacanța de iarnă',
		body: 'Vacanța de iarnă va începe pe 20 decembrie și se va încheia pe 5 ianuarie. Vă dorim sărbători fericite și un An Nou plin de realizări! În această perioadă, vă încurajăm să petreceți timp de calitate alături de familie și prieteni, să vă odihniți și să vă bucurați de activitățile specifice sezonului. Nu uitați să vă pregătiți și pentru revenirea la școală, revizuind materia parcursă până acum.'
	},
	{
		title: 'Simpozion de științe',
		body: 'Elevii din clasele IX-XII sunt invitați să participe la simpozionul de științe care va avea loc pe 15 martie. Înscrierile se fac la profesorul coordonator. Simpozionul va include prezentări ale unor experți în diverse domenii științifice, sesiuni de postere și experimente demonstrative realizate de elevi. Este o oportunitate extraordinară pentru a învăța lucruri noi, a împărtăși cunoștințe și a interacționa cu persoane pasionate de știință.'
	},
	{
		title: 'Campania de donare de sânge',
		body: 'Pe 12 noiembrie, școala noastră organizează o campanie de donare de sânge. Elevii majori și părinții sunt încurajați să participe. Campania este realizată în colaborare cu Centrul de Transfuzii și are scopul de a ajuta persoanele aflate în nevoie de sânge. Toți donatorii vor beneficia de analize gratuite și de o zi liberă de la școală sau serviciu. Vă mulțumim pentru sprijinul acordat!'
	}
];

const tests = [
	{
		title: 'Test de gramatică',
		body: 'Pe 10 octombrie, se va desfășura un test de gramatică pentru clasa a VI-a. Vă rugăm să revizuiți lecțiile despre părțile de vorbire și să veniți pregătiți.'
	},
	{
		title: 'Test de istorie',
		body: 'Testul de istorie pentru clasa a IX-a va avea loc pe 15 octombrie. Acesta va acoperi perioada medievală, așa că asigurați-vă că ați studiat lecțiile relevante.'
	},
	{
		title: 'Test de matematică',
		body: 'Pe 17 octombrie, elevii din clasa a VII-a vor avea un test de matematică pe subiecte de algebră și geometrie. Pregătiți-vă rezolvând probleme din manual și caiete.'
	},
	{
		title: 'Test de biologie',
		body: 'Testul de biologie pentru clasa a XII-a se va ține pe 22 octombrie. Este important să revizuiți structura celulară și procesele de metabolizare. Testul va fi pe bază de întrebări grilă și esențiale.'
	},
	{
		title: 'Test de geografie',
		body: "Pe 25 octombrie, elevii din clasa a VIII-a vor susține un test de geografie pe tema 'Relieful Europei'. Vă rugăm să studiați hărțile și caracteristicile fizice ale diferitelor regiuni."
	}
];

const grade_reasons = [
	'Rezolvarea corectă a exercițiilor',
	'Participare activă la lecții',
	'Performanță excelentă la test',
	'Respectarea termenelor de predare',
	'Colaborare eficientă în echipă'
];

const absence_reasons = [
	'Probleme de sănătate',
	'Programare medicală',
	'Situații familiale de urgență',
	'Participare la concursuri școlare',
	'Probleme de transport'
];

const students_names = [
	'Andrei Popescu',
	'Maria Ionescu',
	'Alexandru Dumitrescu',
	'Elena Popa',
	'Mihai Radu',
	'Ana Georgescu',
	'Gabriel Enescu',
	'Ioana Vasile',
	'Ștefan Mihăilescu',
	'Roxana Stancu',
	'Cătălin Neagu',
	'Irina Teodorescu',
	'Cosmin Vlad',
	'Bianca Marin',
	'Claudiu Diaconu',
	'Alexandra Dobre',
	'Daniel Oprea',
	'Cristina Munteanu',
	'George Nicolae',
	'Andreea Moldovan',
	'Florin Manea',
	'Raluca Barbu',
	'Radu Toma',
	'Nicoleta Iliescu',
	'Alin Matei',
	'Oana Pavel',
	'Vlad Nistor',
	'Diana Savu',
	'Lucian Apostol',
	'Simona Voicu',
	'Liviu Șerban',
	'Denisa Moise',
	'Ionuț Păun',
	'Anca Lupu',
	'Adrian Gherman',
	'Laura Preda',
	'Sebastian Cristea',
	'Carmen Mureșan',
	'Darius Stan',
	'Ioana Drăgan',
	'Nicolae Ciobanu',
	'Ramona Rusu',
	'Paul Antonescu',
	'Mihaela Sima',
	'Ciprian Dumbravă',
	'Andra Petrescu',
	'Victor Tudor',
	'Camelia Grigore',
	'Emanuel Bucur',
	'Corina Iancu',
	'Octavian Sârbu',
	'Eliza Pintea',
	'Rareș Stoica',
	'Larisa Mihalache',
	'Laurențiu Florescu',
	'Teodora Pătrașcu',
	'Adelin Ganea',
	'Gabriela Panait',
	'Vasile Dincă',
	'Carina Tătaru',
	'Ionel Bălan',
	'Anastasia Ungureanu',
	'Dan Iordache',
	'Ioana Călin',
	'Tudor Voinea',
	'Magdalena Rotaru',
	'Claudiu Ion',
	'Cristina Lungu',
	'Eduard Toma',
	'Georgiana Sârbu',
	'Raul Miu',
	'Cristina Dinu',
	'Sergiu Ene',
	'Gabriela Mihalache',
	'Marian Badea',
	'Adriana Botezatu',
	'Robert Dumitriu',
	'Simona Lupu',
	'Teodor Bratu',
	'Alina Ștefan',
	'Ion Popa',
	'Viorica Nistor',
	'Ovidiu Dobre',
	'Delia Nedelcu',
	'Sorin Popovici',
	'Aurelia Marinescu',
	'Călin Frățilă',
	'Sorina Duță',
	'Șerban Ilie',
	'Lavinia Rotaru',
	'Marcel Radu',
	'Valentina Chiriac',
	'Bogdan Sima',
	'Ana-Maria Cojocaru',
	'Constantin Gheorghe',
	'Daniela Enache',
	'Cristian Negrea',
	'Paula Roman',
	'Florin Olaru',
	'Mirela Nedelea',
	'Ionel Mihai',
	'Ioana Cârstea',
	'Sebastian Vlad',
	'Gina Ciobanu',
	'Cătălin Dumitru',
	'Nicoleta Udrea',
	'Lucian Mateescu',
	'Elena Grigorescu',
	'Sorin Marin',
	'Corina Drăghici',
	'Mihai Crăciun',
	'Mihaela Tănase',
	'Ștefan Ionescu',
	'Mariana Dobre',
	'Gabriel Rădulescu',
	'Denisa Pavel',
	'Andrei Sima',
	'Monica Nistor',
	'Ionuț Vasile',
	'Mirela Diaconu',
	'Florin Bucur',
	'Nicoleta Badea',
	'Cezar Voicu',
	'Simona Munteanu',
	'Ciprian Ionescu',
	'Anca Vlad',
	'Constantin Păun',
	'Ioana Rusu',
	'Adrian Georgescu',
	'Cristina Rădulescu',
	'Radu Dima',
	'Gabriela Sima',
	'Tudor Tănase',
	'Oana Popescu',
	'Laurențiu Stoica',
	'Andreea Neagu',
	'Răzvan Dumitrescu',
	'Mariana Vasile',
	'Nicolae Gherman',
	'Corina Dobre',
	'Vlad Ene',
	'Elena Antonescu',
	'Raul Ganea',
	'Ana Voinea',
	'Cosmin Toma',
	'Diana Stan',
	'Sorin Popa',
	'Roxana Marinescu',
	'Călin Mureșan',
	'Gabriela Pintea',
	'Alin Iordache',
	'Ioana Panait',
	'Lucian Savu',
	'Larisa Mihalache',
	'Ștefan Tătaru',
	'Laura Păun',
	'George Vlad',
	'Andreea Lupu',
	'Teodora Nistor',
	'Paul Pintea',
	'Ana Georgescu',
	'Ionuț Rădulescu',
	'Bianca Enache',
	'Cosmin Mihăilescu',
	'Gabriel Dima',
	'Ramona Iliescu',
	'Dan Savu',
	'Raluca Sima',
	'Vasile Mihalache',
	'Adina Popescu',
	'Emanuel Stoica',
	'Mihaela Vasile',
	'Ovidiu Stan',
	'Ioana Dobre',
	'Adrian Mureșan',
	'Cristina Bucur',
	'Sorin Rusu',
	'Eliza Diaconu',
	'Radu Vlad',
	'Monica Teodorescu',
	'Cătălin Gheorghe',
	'Laura Barbu',
	'Marian Cristea',
	'Gabriela Apostol',
	'Ionel Marin',
	'Simona Ganea',
	'Claudiu Nistor',
	'Alina Călin',
	'Nicolae Dumitrescu',
	'Mirela Moldovan',
	'Daniela Șerban',
	'Victor Vlad',
	'Ioana Grigore',
	'Sebastian Ene',
	'Nicoleta Toma',
	'Șerban Radu',
	'Larisa Preda',
	'Adrian Ilie',
	'Corina Savu',
	'Darius Ciobanu',
	'Gabriela Mihăilescu',
	'Lucian Marin',
	'Andreea Panait',
	'Roxana Vlad',
	'Mihai Rotaru',
	'Teodora Popovici',
	'Florin Oprea',
	'Paula Enache',
	'Andrei Voinea',
	'Mihaela Popescu',
	'Gabriel Păun',
	'Cristina Stancu',
	'Liviu Botezatu',
	'Diana Lupu',
	'Laurențiu Bucur',
	'Nicoleta Enescu',
	'Radu Drăgan',
	'Anca Dumbravă',
	'Adelin Marin',
	'Elena Sârbu',
	'Raul Diaconu',
	'Ramona Popa',
	'Ștefan Ionescu',
	'Camelia Antonescu',
	'Marius Mihalache',
	'Simona Mureșan',
	'Cosmin Tudor',
	'Denisa Cârstea',
	'Florin Rusu',
	'Laura Teodorescu',
	'Ciprian Rotaru',
	'Georgiana Savu',
	'Mihai Apostol',
	'Irina Popovici',
	'Gabriel Olaru',
	'Diana Nistor',
	'Paul Mateescu',
	'Monica Vlad',
	'Nicolae Grigorescu',
	'Simona Nedelea',
	'Radu Călin',
	'Paula Dumitru',
	'Sebastian Gheorghe',
	'Ana-Maria Moise',
	'Constantin Bălan',
	'Alin Rotaru',
	'Teodora Călin',
	'Marian Sima',
	'Cătălin Iordache',
	'Alexandra Mihăilescu',
	'Liviu Oprea',
	'Andreea Ionescu',
	'Mirela Vlad',
	'Tudor Diaconu',
	'Corina Pintea',
	'George Popa',
	'Oana Păun',
	'Ștefan Mihalache',
	'Diana Gheorghe',
	'Răzvan Dincă',
	'Laura Preda',
	'Adrian Savu',
	'Cristina Iliescu',
	'Paul Matei',
	'Mariana Bucur',
	'Andrei Popovici',
	'Anca Gherman',
	'Nicolae Călin',
	'Teodora Stoica',
	'Sebastian Rădulescu',
	'Mihaela Ilie',
	'Ciprian Dumitrescu',
	'Ioana Drăghici',
	'Lucian Neagu',
	'Denisa Marin',
	'Marian Teodorescu',
	'Bianca Vlad',
	'Victor Sima',
	'Cristina Diaconu',
	'Alexandru Voinea',
	'Monica Radu',
	'Sorin Popescu',
	'Nicoleta Panait',
	'Radu Enescu',
	'Gabriela Dumitru',
	'George Rădulescu',
	'Laura Ganea',
	'Teodor Mihăilescu',
	'Ana Georgescu',
	'Dan Mureșan',
	'Mihaela Barbu',
	'Cristian Nistor',
	'Larisa Stoica',
	'Ștefan Iordache',
	'Diana Dobre',
	'Marcel Vlad',
	'Ramona Ionescu',
	'Călin Popa',
	'Andreea Rusu',
	'Lucian Antonescu',
	'Irina Bucur',
	'Sorin Ciobanu',
	'Camelia Pintea',
	'Mihai Radu',
	'Elena Marin',
	'Sebastian Neagu',
	'Roxana Dumitrescu'
];

const teachers_names = [
	'Prof. Ion Popescu',
	'Prof. Maria Ionescu',
	'Prof. Alexandru Dumitrescu',
	'Prof. Elena Popa',
	'Prof. Mihai Radu',
	'Prof. Ana Georgescu',
	'Prof. Gabriel Enescu',
	'Prof. Ioana Vasile',
	'Prof. Ștefan Mihăilescu',
	'Prof. Roxana Stancu',
	'Prof. Cătălin Neagu',
	'Prof. Irina Teodorescu',
	'Prof. Cosmin Vlad',
	'Prof. Bianca Marin',
	'Prof. Claudiu Diaconu',
	'Prof. Alexandra Dobre',
	'Prof. Daniel Oprea',
	'Prof. Cristina Munteanu',
	'Prof. George Nicolae',
	'Prof. Andreea Moldovan',
	'Prof. Florin Manea',
	'Prof. Raluca Barbu',
	'Prof. Radu Toma',
	'Prof. Nicoleta Iliescu',
	'Prof. Alin Matei',
	'Prof. Oana Pavel',
	'Prof. Vlad Nistor',
	'Prof. Diana Savu',
	'Prof. Lucian Apostol',
	'Prof. Simona Voicu'
];

@Injectable()
export class TestService extends DBService {
	private readonly admins = [
		{
			name: 'Admin 1',
			password: 'Test123!',
			user: 'admin1'
		},
		{
			name: 'Admin 2',
			password: 'Test123!',
			user: 'admin2'
		},
		{
			name: 'Admin 3',
			password: 'Test123!',
			user: 'admin3'
		}
	];

	private readonly schoolClasses = ['9', '10', '11', '12']
		.map((year) =>
			['A', 'B', 'C', 'D', 'E', 'F'].map((group) => `${year} ${group}`)
		)
		.flat();

	private readonly icons = {
		Informatică: 'computer',
		Biologie: 'leaf',
		Chimie: 'beaker',
		Geografie: 'books',
		Fizică: 'flask',
		Matematică: 'compass',
		Istorie: 'openBook',
		'Limba și literatura română': 'books',
		Religie: 'leaf',
		'Limba engleză': 'books',
		'Educație plastică': 'pencils',
		'Educație muzicală': 'toDo',
		TIC: 'computer',
		Logică: 'hat',
		'Educație antreprenorială': 'toDo',
		Psihologie: 'hat',
		Germană: 'books',
		Franceză: 'books'
	};

	private readonly commonSubjects = [
		'Informatică',
		'Biologie',
		'Chimie',
		'Fizică',
		'Geografie',
		'Matematică',
		'Istorie',
		'Limba și literatura română',
		'Religie',
		'Limba engleză'
	];

	private readonly subjects_9_10 = [
		'Educație plastică',
		'Educație muzicală',
		'TIC'
	];

	private readonly subjects_9 = ['Logică'];

	private readonly subjects_10 = ['Educație antreprenorială', 'Psihologie'];

	private readonly class_joins = [
		{
			subject: 'Germană',
			common_classes: [
				['9 A', '9 D'],
				['10 A', '10 D'],
				['11 A', '11 D'],
				['12 A', '12 D'],
				['9 B', '9 C'],
				['10 B', '10 C'],
				['11 B', '11 C'],
				['12 B', '12 C'],
				['9 E'],
				['10 E'],
				['11 E'],
				['12 E']
			]
		},
		{
			subject: 'Franceză',
			common_classes: [
				['9 A', '9 D'],
				['10 A', '10 D'],
				['11 A', '11 D'],
				['12 A', '12 D'],
				['9 B', '9 C'],
				['10 B', '10 C'],
				['11 B', '11 C'],
				['12 B', '12 C'],
				['9 F'],
				['10 F'],
				['11 F'],
				['12 F']
			]
		}
	];

	private readonly students = this.schoolClasses.map((schoolClass) =>
		Array.from({ length: 30 }).map((el, index) => ({
			name: getRandomElement(students_names),
			user: `s${index}-${schoolClass.toLowerCase()}`,
			password: 'Test123!'
		}))
	);

	private readonly joined_subjects = this.class_joins
		.map((subject) =>
			subject.common_classes.map((schoolClassGroup) => ({
				name: subject.subject,
				schoolClasses: schoolClassGroup
			}))
		)
		.flat();

	private readonly generated_subjects = [
		...this.schoolClasses
			.map((schoolClass) =>
				this.commonSubjects.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat(),
		...this.schoolClasses
			.filter((sc) => sc.includes('9') || sc.includes('10'))
			.map((schoolClass) =>
				this.subjects_9_10.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat(),
		...this.schoolClasses
			.filter((sc) => sc.includes('9'))
			.map((schoolClass) =>
				this.subjects_9.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat(),
		...this.schoolClasses
			.filter((sc) => sc.includes('10'))
			.map((schoolClass) =>
				this.subjects_10.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat()
	];

	private splitIntoMatrix<T>(arr: T[], size: number): T[][] {
		const matrix = [];

		for (let i = 0; i < arr.length; i += size) {
			matrix.push(arr.slice(i, i + size));
		}

		return matrix;
	}

	private splitArrayIntoParts<T>(array: T[], n: number): T[][] {
		const result = [];
		const partSize = Math.ceil(array.length / n);

		for (let i = 0; i < n; i++) {
			const start = i * partSize;
			const end = start + partSize;
			const part = array.slice(start, end);
			result.push(part);
		}

		return result;
	}

	async generateDummyData() {
		const encoded_pass = await BcryptUtils.hashPassword('Test123!');

		const start = +new Date();

		console.log('starting', start);

		const [owner] = await this.db
			.insert(members)
			.values({
				name: 'admin',
				password: encoded_pass,
				user: 'admin@cnibv.com',
				role: 'admin'
			})
			.returning({
				id: members.id
			});

		console.log('created owner', +new Date() - start);

		const [organization] = await this.db
			.insert(organizations)
			.values({
				name: 'CNIBV',
				ownerID: owner.id
			})
			.returning({
				id: organizations.id
			});

		console.log('created organization', +new Date() - start);

		await this.db.update(members).set({
			organizationID: organization.id
		});

		console.log('updated organization ID on owner', +new Date() - start);

		await this.db.insert(members).values(
			this.admins.map((admin) => ({
				organizationID: organization.id,
				role: 'admin' as 'admin',
				name: admin.name,
				user: admin.user,
				password: encoded_pass
			}))
		);

		console.log('added admins', +new Date() - start);

		const st = await this.db
			.insert(members)
			.values(
				this.students.flat().map((student) => ({
					organizationID: organization.id,
					role: 'student' as 'student',
					name: student.name,
					user: student.user,
					password: encoded_pass
				}))
			)
			.returning({ id: members.id });

		console.log('added students', +new Date() - start);

		const sc = await this.db
			.insert(schoolClasses)
			.values(
				this.schoolClasses.map((schoolClass) => ({
					organizationID: organization.id,
					name: schoolClass
				}))
			)
			.returning();

		console.log('added school classes', +new Date() - start);

		const s = await this.db
			.insert(subjects)
			.values(
				this.generated_subjects.map((subject) => ({
					organizationID: organization.id,
					name: subject.name,
					icon: this.icons[subject.name],
					metadata: {
						minGrades: 5
					}
				}))
			)
			.returning();

		console.log('added subjects', +new Date() - start);

		const split_students = this.splitIntoMatrix(st, 30);

		await this.db.insert(studentsToSchoolClasses).values(
			split_students
				.map((students, index) =>
					students.map((student) => ({
						studentID: student.id,
						schoolClassID: sc[index].id
					}))
				)
				.flat()
		);

		console.log('Added students to school classes', +new Date() - start);

		await this.db.insert(subjectsToSchoolClasses).values(
			s.map((subject, index) => ({
				subjectID: subject.id,
				schoolClassID: sc.find(
					(schoolClass) =>
						schoolClass.name === this.generated_subjects[index].schoolClass
				).id
			}))
		);

		console.log('Added more students to school classes', +new Date() - start);

		const js = await this.db
			.insert(subjects)
			.values(
				this.joined_subjects.map((subject) => ({
					name: subject.name,
					organizationID: organization.id,
					icon: this.icons[subject.name],
					metadata: {
						minGrades: 5
					}
				}))
			)
			.returning();

		console.log('Added joined subjects', +new Date() - start);

		await this.db.insert(subjectsToSchoolClasses).values(
			this.joined_subjects
				.map((subject, subjectIndex) =>
					subject.schoolClasses.map((schoolClass) => ({
						subjectID: js[subjectIndex].id,
						schoolClassID: sc.find((el) => el.name === schoolClass).id
					}))
				)
				.flat()
		);

		console.log('added subjects to school classes', +new Date() - start);

		const unique_subjects = await this.db
			.select({
				name: subjects.name
			})
			.from(subjects)
			.groupBy(subjects.name);

		console.log('Fetched unique subjects', +new Date() - start);

		const teachers = await this.db
			.insert(members)
			.values(
				unique_subjects.map((subject, index) => ({
					name: getRandomElement(teachers_names),
					user: `t${index}`,
					password: encoded_pass,
					organizationID: organization.id,
					role: 'teacher' as 'teacher'
				}))
			)
			.returning({ id: members.id });

		console.log('Added teachers', +new Date() - start);

		const total_subjects = await this.db.select().from(subjects);

		console.log('Fetched total subjects', +new Date() - start);

		await this.db.insert(teachersToSubjects).values(
			total_subjects.map((subject) => ({
				teacherID:
					teachers[
						unique_subjects.findIndex((sub) => sub.name === subject.name)
					].id,
				subjectID: subject.id
			}))
		);

		console.log('Added teachers to subjects', +new Date() - start);

		const extra_teacher = await this.db
			.insert(members)
			.values({
				name: 'Ionescu Popa',
				user: `t${unique_subjects.length}`,
				password: encoded_pass,
				organizationID: organization.id,
				role: 'teacher' as 'teacher'
			})
			.returning({ id: members.id });

		console.log('added extra informatics teacher', +new Date() - start);

		await this.db.insert(teachersToSubjects).values(
			total_subjects
				.filter((subject) => subject.name === this.commonSubjects[0])
				.map((subject) => ({
					teacherID: extra_teacher[0].id,
					subjectID: subject.id
				}))
		);

		console.log(
			'added extra informatics teacher to subjects',
			+new Date() - start
		);

		const studentSubjectLinks: {
			students: {
				id: number;
				name: string;
			}[];
			subjects: {
				id: number;
				name: string;
			}[];
		}[] = (
			await this.db.execute(sql`
          SELECT ${schoolClasses.name},
                 ${schoolClasses.id},
                 (SELECT json_agg(json_build_object('id', ${members.id}, 'name', ${members.name}))
                  FROM ${studentsToSchoolClasses}
                           INNER JOIN ${members} ON ${members.id} = ${studentsToSchoolClasses.studentID} AND ${members.role} = 'student'
                  WHERE ${studentsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as students,

                 (SELECT json_agg(json_build_object('id', ${subjects.id}, 'name', ${subjects.name}))
                  FROM ${subjectsToSchoolClasses}
                           INNER JOIN ${subjects} ON ${subjects.id} = ${subjectsToSchoolClasses.subjectID} AND NOT ${subjects.name} IN ${this.class_joins.map((join) => join.subject)}
                  WHERE ${subjectsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as subjects
          FROM ${schoolClasses}
          WHERE ${schoolClasses.organizationID} = ${organization.id};
			`)
		).rows;

		console.log('Fetched students to subjects', +new Date() - start);

		await this.db.insert(studentsToSubjects).values(
			studentSubjectLinks
				.map((schoolClass) =>
					schoolClass.students.map((student) =>
						schoolClass.subjects.map((subject) => ({
							studentID: student.id,
							subjectID: subject.id
						}))
					)
				)
				.flat(2)
		);

		console.log('Added students to subjects', +new Date() - start);

		const specialStudentSubjectLinks: {
			students: {
				id: number;
				name: string;
			}[];
			subjects: {
				id: number;
				name: string;
			}[];
		}[] = (
			await this.db.execute(sql`
          SELECT ${schoolClasses.name},
                 ${schoolClasses.id},
                 (SELECT json_agg(json_build_object('id', ${members.id}, 'name', ${members.name}))
                  FROM ${studentsToSchoolClasses}
                           INNER JOIN ${members} ON ${members.id} = ${studentsToSchoolClasses.studentID} AND ${members.role} = 'student'
                  WHERE ${studentsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as students,

                 (SELECT json_agg(json_build_object('id', ${subjects.id}, 'name', ${subjects.name}))
                  FROM ${subjectsToSchoolClasses}
                           INNER JOIN ${subjects} ON ${subjects.id} = ${subjectsToSchoolClasses.subjectID} AND ${subjects.name} IN ${this.class_joins.map((join) => join.subject)}
                  WHERE ${subjectsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as subjects
          FROM ${schoolClasses}
          WHERE ${schoolClasses.organizationID} = ${organization.id};
			`)
		).rows;

		console.log('Fetched special students to subjects', +new Date() - start);

		await this.db.insert(studentsToSubjects).values(
			specialStudentSubjectLinks
				.map((schoolClass) =>
					this.splitArrayIntoParts(
						schoolClass.students,
						schoolClass.subjects.length
					).map((part, index) =>
						part.map((student) => ({
							studentID: student.id,
							subjectID: schoolClass.subjects[index].id
						}))
					)
				)
				.flat(2)
		);

		console.log('Added students to special subjects', +new Date() - start);

		const teachersToSubjectsTotal = await this.db
			.select()
			.from(teachersToSubjects);

		await this.db.insert(posts).values(
			teachersToSubjectsTotal.map((teacherToSubject) => {
				const assignment = getRandomElement(assignments);

				return {
					memberID: teacherToSubject.teacherID,
					subjectID: teacherToSubject.subjectID,
					title: assignment.title,
					body: assignment.body,
					type: 'assignment' as 'assignment'
				};
			})
		);
		await this.db.insert(posts).values(
			teachersToSubjectsTotal.map((teacherToSubject) => {
				const test = getRandomElement(tests);

				return {
					memberID: teacherToSubject.teacherID,
					subjectID: teacherToSubject.subjectID,
					title: test.title,
					body: test.body,
					type: 'test' as 'test'
				};
			})
		);
		await this.db.insert(posts).values(
			teachersToSubjectsTotal.map((teacherToSubject) => {
				const material = getRandomElement(materials);

				return {
					memberID: teacherToSubject.teacherID,
					subjectID: teacherToSubject.subjectID,
					title: material.title,
					body: material.body,
					type: 'material' as 'material'
				};
			})
		);
		await this.db.insert(posts).values(
			teachersToSubjectsTotal.map((teacherToSubject) => {
				const announcement = getRandomElement(announcements);

				return {
					memberID: teacherToSubject.teacherID,
					subjectID: teacherToSubject.subjectID,
					title: announcement.title,
					body: announcement.body,
					type: 'announcement' as 'announcement'
				};
			})
		);

		const subjectsWithTeachersAndStudentss = (
			await this.db.execute(sql`
          select "Subject".id,
                 jsonb_agg(distinct "StudentToSubject"."studentID") as "students",
                 jsonb_agg(distinct "TeacherToSubject"."teacherID") as "teachers"
          from "Subject"
                   left join "StudentToSubject" on "StudentToSubject"."subjectID" = "Subject".id
                   left join "TeacherToSubject" on "TeacherToSubject"."subjectID" = "Subject".id
          group by "Subject".id
			`)
		).rows;

		function splitArrayIntoChunkss<T>(array: T[], chunkSize: number): any[][] {
			const result: T[][] = [];
			for (let i = 0; i < array.length; i += chunkSize) {
				const chunk = array.slice(i, i + chunkSize);
				result.push(chunk);
			}
			return result;
		}

		const chunkss = splitArrayIntoChunkss(subjectsWithTeachersAndStudentss, 1);
		const dates = [
			new Date('10.06.2024').toISOString(),
			new Date('10.05.2024').toISOString(),
			new Date('10.04.2024').toISOString()
		];

		for (const chunk of chunkss) {
			await this.db.insert(grades).values(
				chunk
					.map((subject) =>
						subject.students.map((student) =>
							subject.teachers.map((teacher) =>
								['9', '7', '10'].map((grade, index) => ({
									studentID: student,
									teacherID: teacher,
									subjectID: subject.id,
									value: grade,
									date: dates[index],
									reason: getRandomElement(grade_reasons)
								}))
							)
						)
					)
					.flat(3)
			);

			await this.db.insert(absences).values(
				chunk
					.map((subject) =>
						subject.students.map((student) =>
							subject.teachers.map((teacher) =>
								[false, true, false].map((absence, index) => ({
									studentID: student,
									teacherID: teacher,
									subjectID: subject.id,
									excused: absence,
									date: dates[index],
									reason: absence
										? getRandomElement(absence_reasons)
										: undefined
								}))
							)
						)
					)
					.flat(3)
			);
		}

		await this.db
			.update(schoolClasses)
			.set({
				classMasterID: 734
			})
			.where(eq(schoolClasses.id, 1));
	}
}
