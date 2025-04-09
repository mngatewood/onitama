<a id="top"></a>

<!-- Project Overview -->
<h1>Onitama</h1>
<p>Onitama is a fast-paced, abstract strategy game of martial tactics where players use ever-changing movement cards to outmaneuver their opponent on a 5x5 board.</p>

<div align="center">
	<a href="https://onitama-production.up.railway.app/">View Live</a>
	&nbsp;&nbsp;|&nbsp;&nbsp;
	<a href="https://github.com/mngatewood/onitama/issues/new?labels=bug">Report a Bug</a>
	&nbsp;&nbsp;|&nbsp;&nbsp;
	<a href="https://github.com/mngatewood/onitama/issues/new?labels=enhancement">Request a Feature</a>
</div>
<br>

<!-- Table of Contents -->
<details>
	<summary>Table of Contents</summary>
	<ol>
		<li><a href="#about">About the Project</a></li>
		<li><a href="#getting-started">Getting Started</a></li>
		<li><a href="#license">License</a></li>
		<li><a href="#contact">Contact</a></li>
	</ol>
</details>

<!-- About -->
<h2 id="about">About the Project</h2>

<img src="https://raw.githubusercontent.com/mngatewood/onitama/refs/heads/main/public/website-project-onitama.png" alt="project screenshot">
<br>

<p>Onitama is a two-player strategy board game played on a 5x5 grid. Each player controls five pieces: four students and one master. At the start of the game, five movement cards are randomly drawn. Each player is given two cards, and the fifth card is placed in a neutral position.</p>

<p>On a player’s turn, they use one of their two movement cards to move one of their pieces according to the card’s pattern. After using a card, it is exchanged with the card set aside, ensuring that the available moves constantly change throughout the game.</p>

<p>The objective is to win by either:</p>
<ul>
<li>Capturing the opponent’s master (the Way of the Stone), or</li>
<li>Moving your own master onto the opponent’s starting position (the Way of the Stream).</li>
</ul>
<p>The game combines simple rules with deep strategic possibilities, encouraging players to plan ahead, adapt to shifting options, and anticipate their opponent’s moves.</p>

<h3 id="powered-by">Powered By</h3>

<div align="center">
	<img src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs" />
	&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://img.shields.io/badge/MongoDB-black?logo=mongodb" />
	&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://img.shields.io/badge/Docker-black?logo=docker" />
	&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://img.shields.io/badge/PostgreSQL-black?logo=postgresql" />
	&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://img.shields.io/badge/TailwindCSS-black?logo=tailwindcss" />
	&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://img.shields.io/badge/Socket.io-black?logo=socketdotio" />
	&nbsp;&nbsp;&nbsp;&nbsp;
	<img src="https://img.shields.io/badge/Playwright-black" />
</div>
<br>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Getting Started -->
<h2 id="getting-started">Getting Started</h2>
<ol>
	<li>
		<p>
			<a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository">Clone this repository.</a>
		</p>
		<pre><code>git clone https://github.com/mngatewood/onitama.git</code></pre>
	</li>
	<li>
		<p>Install dependencies.</p>
		<pre><code>npm install</code></pre>
	</li>
	<li>
		<p>Build the Docker container</p>
		<pre><code>docker build -t onitama .</code></pre>
	</li>
	<li>
		<p>Run the Docker container</p>
		<pre><code>docker run -p 3000:3000 onitama</code></pre>
	</li>
	<li>
		<p>Open <a href="http://localhost:3000">http://localhost:3000</a> with your browser to see the result.</p>
	</li>
</ol>


<p align="right">(<a href="#top">back to top</a>)</p>

<h2 id="license">License</h2>

<p>Distributed under the MIT License. See <a href="https://github.com/mngatewood/onitama/blob/main/LICENSE.txt"><code>LICENSE.txt</code></a> for more information.</p>

<p align="right">(<a href="#top">back to top</a>)</p>

<h2 id="contact">Contact</h2>

<div align="center">
	<a href="https://www.mngatewood.com">Website</a>
	&nbsp;&nbsp;|&nbsp;&nbsp;
	<a href="mailto:michael@mngatewood.com">Email</a>
	&nbsp;&nbsp;|&nbsp;&nbsp;
	<a href="https://www.linkedin.com/in/mngatewood/">LinkedIn</a>
	&nbsp;&nbsp;|&nbsp;&nbsp;
	<a href="https://github.com/mngatewood">GitHub</a>
</div>
<br>

<p align="right">(<a href="#top">back to top</a>)</p>
