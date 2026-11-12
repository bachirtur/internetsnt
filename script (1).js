'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KEY = 'snt-internet-v1';
let S;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
S = Object.assign({ seen: [], done: [], last: null }, S || {});
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
const nd = (id, x, y, e, l, s, side) => ({ id, x, y, e, l, s, side });

/* ---------- CONTENU PÉDAGOGIQUE ---------- */
const M = [
  { t: 'Structure d\'un réseau', i: '🖧', r: 'Réseau local, switch, routeur et liaisons.', kw: ['Internet', 'LAN', 'switch', 'routeur', 'Ethernet', 'Wi-Fi', 'fibre optique'],
    n: [
      { h: 'Internet et réseau local', d: 'Comment ton téléphone et l\'ordinateur de ton ami peuvent-ils s\'échanger une photo ?', c: 'Un <b>réseau</b> relie des appareils pour qu\'ils échangent des données. Chez toi, tes appareils forment un <b>réseau local (LAN)</b>. Le <b>routeur</b> relie ce réseau local au reste du monde : Internet est le <b>réseau des réseaux</b>.', k: 'Internet = réseau mondial qui interconnecte des millions de réseaux. LAN = réseau local (maison, classe).', q: ['Quel appareil relie ton réseau local à Internet ?', ['Le switch', 'Le routeur', 'L\'écran'], 1] },
      { h: 'Matériel et liaisons', d: 'Pourquoi peut-on se connecter en Wi-Fi ou avec un câble ?', c: 'Le <b>switch</b> relie les ordinateurs d\'un même réseau local et envoie les données au bon destinataire. Les liaisons : <b>Ethernet</b> (câble), <b>Wi-Fi</b> (ondes radio) et <b>fibre optique</b> (lumière dans un fil de verre, très rapide).', k: 'Switch = relie les machines du LAN. Fibre optique = transmission par la lumière.', q: ['Quelle liaison utilise la lumière ?', ['Ethernet', 'Wi-Fi', 'Fibre optique'], 2] }
    ] },
  { t: 'TCP/IP et adresses IP', i: '🔢', r: 'Adresses IPv4/IPv6, masque, DHCP.', kw: ['IPv4', 'IPv6', 'IP privée/publique', 'masque', 'DHCP', 'IP statique', 'TCP/IP'],
    n: [
      { h: 'L\'adresse IP', d: 'Comment reconnaître une machine parmi des milliards ?', c: 'Chaque appareil a une <b>adresse IP</b>, comme une adresse postale. En <b>IPv4</b>, elle s\'écrit avec 4 nombres de 0 à 255 (4 <b>octets</b> de 8 bits) : 192.168.1.10. L\'<b>IPv6</b> est plus longue (128 bits) car les IPv4 manquent. Une IP <b>privée</b> sert dans le réseau local, une IP <b>publique</b> est visible sur Internet. <b>TCP/IP</b> est l\'ensemble des protocoles d\'Internet.', k: 'IPv4 = 4 octets (32 bits). Privée = dans le LAN, publique = sur Internet.', q: ['Combien de bits a une adresse IPv4 ?', ['8', '32', '128'], 1] },
      { h: 'Masque, ID réseau, DHCP', d: 'Comment savoir si deux machines sont dans le même réseau ?', c: 'Le <b>masque de sous-réseau</b> coupe l\'adresse en deux : l\'<b>ID réseau</b> (le quartier) et l\'<b>ID hôte</b> (le numéro de la maison). Avec 255.255.255.0, les 3 premiers octets désignent le réseau. L\'IP peut être donnée automatiquement par le <b>DHCP</b> ou fixée à la main (<b>IP statique</b>). Deux machines ne doivent jamais avoir la même IP.', k: 'DHCP = attribution automatique d\'IP. IP statique = fixée manuellement.', q: ['Avec le masque 255.255.255.0, l\'ID réseau de 192.168.1.10 est :', ['192.168.1.0', '192.168.0.0', '10.0.0.0'], 0] }
    ] },
  { t: 'Communication entre réseaux', i: '🔀', r: 'Passerelle, routeur, table de routage, client-serveur.', kw: ['passerelle', 'routeur', 'table de routage', 'client', 'serveur'],
    n: [{ h: 'Passer d\'un réseau à un autre', d: 'Un ordinateur du réseau A veut écrire à un ordinateur du réseau B.', c: 'Si la destination est dans un autre réseau, la machine envoie le paquet à sa <b>passerelle</b> (l\'adresse du routeur dans son réseau). Le routeur consulte sa <b>table de routage</b> pour choisir la bonne sortie. Dans l\'<b>architecture client-serveur</b>, un client demande un service et un serveur répond.', k: 'Passerelle = porte de sortie du réseau. Table de routage = liste des chemins du routeur.', q: ['Si la passerelle est mal configurée, le paquet…', ['arrive quand même', 'est perdu'], 1] }] },
  { t: 'Serveur DNS', i: '📒', r: 'Nom de domaine et résolution de noms.', kw: ['nom de domaine', 'DNS', 'résolution de noms'],
    n: [{ h: 'Le DNS, l\'annuaire d\'Internet', d: 'Tu tapes www.ordi.org et non un numéro : qui fait la traduction ?', c: 'Les humains retiennent des <b>noms de domaine</b>, les machines utilisent des <b>adresses IP</b>. Le <b>serveur DNS</b> est un annuaire : il traduit le nom en adresse IP (<b>résolution de noms</b>). Ensuite le navigateur contacte le serveur Web à cette adresse.', k: 'DNS = annuaire qui associe un nom de domaine à une adresse IP.', q: ['Que renvoie le serveur DNS ?', ['Une page Web', 'Une adresse IP'], 1] }] },
  { t: 'Les ports', i: '🚪', r: 'Port, services et adresse IP:port.', kw: ['port', 'IP:port', '21', '23', '25', '53', '80'],
    n: [{ h: 'IP + port = la bonne application', d: 'Un serveur fait Web, mail et FTP en même temps : comment s\'y retrouver ?', c: 'Le <b>port</b> est un numéro (0 à 65535) qui désigne le service visé. L\'IP trouve la machine, le port trouve l\'application : <b>192.168.1.10:80</b>. Ports <b>reconnus</b> (0-1023) : 21 FTP, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP. Ports <b>enregistrés</b> (1024-49151). Ports <b>dynamiques</b> (49152-65535).', k: 'Adresse complète = IP + port.', q: ['Quel est le port du Web (HTTP) ?', ['21', '80', '25'], 1] }] },
  { t: 'Protocoles et transport', i: '📦', r: 'TCP : paquets, vérification, retransmission.', kw: ['TCP', 'paquet', 'numérotation', 'retransmission', 'réassemblage'],
    n: [{ h: 'Le voyage d\'une photo', d: 'Comment une photo de 3 Mo traverse-t-elle Internet ?', c: '<b>TCP</b> découpe les données en <b>paquets numérotés</b>. Ils voyagent séparément. Le récepteur vérifie leur arrivée ; si un paquet manque, il demande la <b>retransmission</b>. Puis il <b>réassemble</b> les paquets dans l\'ordre.', k: 'TCP = découpage, numérotation, vérification, retransmission, réassemblage.', q: ['Que fait TCP si un paquet est perdu ?', ['Il l\'ignore', 'Il demande de le renvoyer'], 1] }] },
  { t: 'Réseau pair-à-pair (P2P)', i: '🤝', r: 'Client-serveur contre P2P.', kw: ['P2P', 'pair', 'client-serveur', 'centralisé', 'décentralisé'],
    n: [{ h: 'Client-serveur ou pair-à-pair ?', d: 'Quand tu télécharges un film, vient-il d\'un serveur ou d\'autres internautes ?', c: 'Client-serveur : un serveur central fournit les fichiers. <b>Pair-à-pair (P2P)</b> : chaque machine est à la fois client et serveur. <b>P2P centralisé</b> : un serveur indexe qui possède quoi, mais les fichiers passent entre pairs. <b>P2P décentralisé</b> : aucun serveur central.', k: 'P2P = les machines échangent directement entre elles.', q: ['Dans un P2P décentralisé…', ['il y a un serveur central', 'il n\'y a pas de serveur central'], 1] }] },
  { t: 'Courriers électroniques', i: '✉️', r: 'Adresse mail, SMTP, POP3, IMAP.', kw: ['adresse mail', 'SMTP', 'POP3', 'IMAP', 'serveur de messagerie'],
    n: [{ h: 'Du clic sur Envoyer à la boîte de réception', d: 'toto@free.fr écrit à tata@gmail.com : que se passe-t-il ?', c: 'Une adresse = <b>identifiant@domaine</b>. Le message part vers le serveur <b>SMTP</b> de l\'expéditeur, qui le transmet au serveur du destinataire. Pour le lire : <b>POP3</b> télécharge les messages sur l\'appareil (et les retire du serveur) ; <b>IMAP</b> les laisse sur le serveur et synchronise tous les appareils.', k: 'SMTP = envoyer. POP3 / IMAP = recevoir.', q: ['Quel protocole sert à envoyer un mail ?', ['IMAP', 'SMTP', 'POP3'], 1] }] }
];

/* ---------- SIMULATIONS ---------- */
const net = { on: [], ln: [], sel: null, r: null };
const P1 = { pc1: nd('pc1', 80, 190, '💻', 'PC 1', '192.168.0.10'), pc2: nd('pc2', 520, 190, '💻', 'PC 2', '192.168.0.11'), sw: nd('sw', 300, 190, '🔀', 'Switch'), rt: nd('rt', 300, 50, '📡', 'Routeur') };
const sel = (id, l, d, v) => ({ id, l, d, v });

const CFG = {
  1: {
    g() {
      const d = { nodes: net.on.map(k => P1[k]), links: net.ln.map(l => l.split('-')), steps: [], sel: net.sel,
        onNode(id) { if (!net.sel) net.sel = id; else { if (net.sel !== id) { const k = [net.sel, id].sort().join('-'); net.ln = net.ln.includes(k) ? net.ln.filter(x => x !== k) : [...net.ln, k]; } net.sel = null; } net.r(); } };
      if (!(net.on.includes('pc1') && net.on.includes('pc2'))) { d.err = 'Ajoute deux ordinateurs avec les boutons ci-dessus.'; return d; }
      const adj = id => net.ln.filter(l => l.split('-').includes(id)).map(l => l.split('-').find(x => x !== id));
      const prev = { pc1: null }, q = ['pc1'];
      while (q.length) { const u = q.shift(); adj(u).forEach(v => { if (!(v in prev)) { prev[v] = u; q.push(v); } }); }
      if (!('pc2' in prev)) { d.err = 'PC 1 et PC 2 ne sont pas reliés. Clique sur un appareil puis sur un autre pour tracer un câble.'; return d; }
      const p = []; for (let u = 'pc2'; u; u = prev[u]) p.unshift(u);
      p.slice(1).forEach((v, k) => d.steps.push({ f: p[k], t: v, l: '✉', m: `Le paquet passe de <b>${P1[p[k]].l}</b> à <b>${P1[v].l}</b>.` }));
      d.steps.push({ f: 'pc2', t: 'pc2', l: '✔', m: 'PC 2 a reçu le message : la communication fonctionne !' });
      return d;
    },
    x(h, r) {
      net.on = []; net.ln = []; net.sel = null; net.r = r;
      h.innerHTML = '<button data-a="pc">＋ Ordinateur</button><button data-a="sw">＋ Switch</button><button data-a="rt">＋ Routeur</button><button data-a="cl">🗑 Vider</button><small>Clique sur un appareil puis sur un autre pour les relier par un câble (re-clique pour le retirer).</small>';
      h.onclick = e => { const a = e.target.dataset.a; if (!a) return;
        if (a === 'cl') { net.on = []; net.ln = []; net.sel = null; }
        else { const k = a === 'pc' ? (!net.on.includes('pc1') ? 'pc1' : !net.on.includes('pc2') ? 'pc2' : null) : a; if (k && !net.on.includes(k)) net.on.push(k); }
        r(); };
    }
  },
  2: {
    o: [sel('sc', 'Scénario :', 'dhcp', [['dhcp', 'IP automatique (DHCP)'], ['sta', 'IP statique (manuelle)'], ['con', 'Conflit d\'IP']])],
    g(O) {
      const T = {
        dhcp: [
          { f: 'p1', t: 'd', l: '?', m: 'PC 1 vient de se connecter sans adresse. Il demande : « Y a-t-il un serveur DHCP ? »' },
          { f: 'd', t: 'p1', l: '.23', m: 'Le serveur DHCP propose une adresse libre : <b>192.168.0.23</b> (masque 255.255.255.0, passerelle 192.168.0.1).' },
          { f: 'p1', t: 'd', l: 'OK', m: 'PC 1 accepte l\'adresse proposée.' },
          { f: 'd', t: 'p1', l: '✔', m: 'Le DHCP confirme : PC 1 possède <b>192.168.0.23</b> pour une durée limitée (le bail).' }],
        sta: [
          { f: 'p1', t: 'd', l: '.50', m: 'L\'administrateur saisit à la main l\'adresse <b>192.168.0.50</b> sur PC 1 : c\'est une IP statique.' },
          { f: 'd', t: 'p1', l: '✔', m: 'Aucune demande au DHCP : l\'adresse ne change jamais (pratique pour un serveur ou une imprimante).' }],
        con: [
          { f: 'p1', t: 'd', l: '.5', m: 'PC 1 utilise l\'adresse <b>192.168.0.5</b> (réglée à la main).' },
          { f: 'p2', t: 'd', l: '.5', m: 'PC 2 est réglé, par erreur, sur la <b>même</b> adresse 192.168.0.5 !' },
          { f: 'd', t: 'p2', l: '⚠', bad: 1, m: '<b>Conflit d\'adresse IP</b> : le réseau ne sait plus à qui livrer les données. Solution : changer l\'une des deux adresses.' }]
      }[O.sc];
      return { nodes: [nd('p1', 80, 130, '💻', 'PC 1'), nd('d', 300, 50, '🖥️', 'Serveur DHCP', '192.168.0.1'), nd('p2', 520, 130, '💻', 'PC 2')], links: [['p1', 'd'], ['p2', 'd']], steps: T };
    },
    x(h) {
      h.innerHTML = '<div class="box" style="width:100%"><h3>🔬 Analyseur d\'adresse IP et de masque</h3><input class="ip" value="192.168.1.10" aria-label="Adresse IP"> <input class="mk" value="255.255.255.0" aria-label="Masque"><div class="out"></div></div>';
      const ip = $('.ip', h), mk = $('.mk', h), out = $('.out', h);
      const f = () => {
        const a = ip.value.split('.').map(Number), m = mk.value.split('.').map(Number);
        const ok = x => x.length === 4 && x.every(v => Number.isInteger(v) && v >= 0 && v <= 255);
        if (!ok(a) || !ok(m)) { out.innerHTML = '<p class="err">Saisis 4 nombres de 0 à 255 séparés par des points.</p>'; return; }
        const b = v => v.toString(2).padStart(8, '0');
        const bin = a.map((v, i) => [...b(v)].map((c, k) => (b(m[i])[k] === '1' ? `<u>${c}</u>` : c)).join(''));
        out.innerHTML = `<p>Les chiffres <u style="text-decoration:none;color:#1e6bff;font-weight:700">bleus</u> appartiennent à l'ID réseau, les autres à l'ID hôte.</p><div class="oct">${a.map((v, i) => `<span><b>${v}</b><i>${bin[i]}</i></span>`).join('')}</div><p>ID réseau : <b>${a.map((v, i) => v & m[i]).join('.')}</b> · ID hôte : <b>${a.map((v, i) => v & ~m[i] & 255).join('.')}</b></p>`;
      };
      ip.oninput = mk.oninput = f; f();
    }
  },
  3: {
    o: [sel('gw', 'Passerelle de PC A :', '192.168.0.1', [['192.168.0.1', 'Correcte (192.168.0.1)'], ['192.168.1.1', 'Erronée (192.168.1.1)'], ['', 'Aucune']])],
    g(O) {
      const s = [{ f: 'a', t: 'a', l: '?', m: 'PC A (192.168.0.10, réseau <b>192.168.0.0</b>) veut joindre PC B (192.168.1.20, réseau <b>192.168.1.0</b>). Réseaux différents : passage obligatoire par la passerelle.' }];
      if (O.gw === '192.168.0.1') s.push(
        { f: 'a', t: 'r', l: '→B', m: 'PC A envoie le paquet à sa passerelle <b>192.168.0.1</b> (le routeur).' },
        { f: 'r', t: 'r', l: '📋', m: 'Table de routage : <i>192.168.0.0 → interface 1 · 192.168.1.0 → interface 2</i>. Le routeur choisit l\'interface 2.' },
        { f: 'r', t: 'b', l: '→B', m: 'Le routeur transmet le paquet dans le réseau B.' },
        { f: 'b', t: 'b', l: '✔', m: 'PC B a reçu le message.' });
      else s.push({ f: 'a', t: 'a', l: '✘', bad: 1, m: O.gw ? `La passerelle <b>${O.gw}</b> n'est pas dans le réseau de PC A : injoignable. Le paquet est perdu.` : 'Aucune passerelle : PC A ne sait pas comment sortir de son réseau. Le paquet est perdu.' });
      return { nodes: [nd('a', 70, 130, '💻', 'PC A', '192.168.0.10'), nd('r', 300, 130, '📡', 'Routeur', '0.1 | 1.1'), nd('b', 530, 130, '💻', 'PC B', '192.168.1.20')], links: [['a', 'r'], ['r', 'b']], steps: s };
    }
  },
  4: {
    o: [sel('ip', 'IP associée à www.ordi.org dans le DNS :', '93.184.216.34')],
    g(O) {
      const ip = esc(O.ip.trim()), okip = O.ip.trim() === '93.184.216.34';
      const s = [
        { f: 'pc', t: 'dns', l: 'www?', m: 'Tu saisis <b>www.ordi.org</b>. Le navigateur envoie une <b>demande DNS</b> : « Quelle est l\'adresse de www.ordi.org ? »' },
        { f: 'dns', t: 'dns', l: '🔎', m: 'Le serveur DNS cherche le nom dans son annuaire.' },
        { f: 'dns', t: 'pc', l: 'IP', m: `Réponse : www.ordi.org = <b>${ip}</b>.` },
        okip ? { f: 'pc', t: 'web', l: 'GET', m: 'Le navigateur se connecte au serveur Web <b>93.184.216.34</b>.' }
          : { f: 'pc', t: 'web', l: 'GET', bad: 1, m: `Aucun serveur Web ne répond à l'adresse <b>${ip}</b> : le site est introuvable. Le DNS pointait vers la mauvaise IP.` }];
      if (okip) s.push({ f: 'web', t: 'pc', l: '📄', m: 'Le serveur envoie la page : elle s\'affiche dans le navigateur ✔' });
      return { nodes: [nd('pc', 70, 130, '💻', 'Navigateur', 'www.ordi.org'), nd('dns', 300, 50, '📒', 'Serveur DNS'), nd('web', 530, 130, '🌐', 'Serveur Web', '93.184.216.34')], links: [['pc', 'dns'], ['pc', 'web']], steps: s };
    }
  },
  5: {
    o: [sel('pt', 'Service demandé :', '80', [['21', 'FTP (21)'], ['23', 'Telnet (23)'], ['25', 'SMTP (25)'], ['53', 'DNS (53)'], ['80', 'Web HTTP (80)']])],
    g(O) {
      const sv = [['21', '📁', 'FTP'], ['23', '⌨️', 'Telnet'], ['25', '✉️', 'SMTP'], ['53', '📒', 'DNS'], ['80', '🌐', 'HTTP']];
      const nodes = [nd('c', 50, 130, '💻', 'Client'), nd('s', 260, 130, '🖥️', 'Serveur', '192.168.1.10'), ...sv.map(([p, e, n], i) => nd('p' + p, 470, 28 + i * 51, e, `${n} :${p}`, '', 1))];
      const w = sv.find(x => x[0] === O.pt);
      return { nodes, links: sv.map(x => ['s', 'p' + x[0]]), steps: [
        { f: 'c', t: 's', l: ':' + O.pt, m: `Le client envoie sa demande à l'adresse complète <b>192.168.1.10:${O.pt}</b>. L'IP désigne la machine, le port désigne le service.` },
        { f: 's', t: 'p' + O.pt, l: ':' + O.pt, m: `Le serveur lit le port <b>${O.pt}</b> et dirige les données vers l'application <b>${w[2]}</b>.` },
        { f: 'p' + O.pt, t: 'p' + O.pt, l: '✔', m: `Le service ${w[2]} traite la demande ; les autres services ne sont pas dérangés.` }] };
    }
  },
  6: {
    o: [sel('loss', 'Perdre un paquet :', '1', [['1', 'Oui (P3)'], ['0', 'Non']])],
    g(O) {
      const s = [{ f: 'e', t: 'e', l: '🖼️', m: 'TCP <b>découpe</b> la photo en 4 morceaux et crée 4 paquets <b>numérotés</b> : P1, P2, P3, P4.' }];
      for (let k = 1; k <= 4; k++) {
        if (k === 3 && O.loss === '1') s.push({ f: 'e', t: 'r', l: 'P3', bad: 1, m: 'Le paquet <b>P3</b> est perdu en route (routeur saturé) !' });
        else s.push({ f: 'e', t: 'd', l: 'P' + k, m: `Transport du paquet <b>P${k}</b> jusqu'au récepteur.` });
      }
      if (O.loss === '1') s.push(
        { f: 'd', t: 'd', l: '✔?', m: 'Le récepteur <b>vérifie</b> les numéros reçus : P1, P2, P4. Il manque P3.' },
        { f: 'd', t: 'e', l: 'P3 ?', m: 'Il demande la <b>retransmission</b> de P3.' },
        { f: 'e', t: 'd', l: 'P3', m: 'L\'émetteur renvoie P3.' });
      s.push({ f: 'd', t: 'd', l: '🖼️', m: 'Les 4 paquets sont là : <b>réassemblage</b> dans l\'ordre. La photo est complète ✔' });
      return { nodes: [nd('e', 60, 130, '💻', 'Émetteur'), nd('r', 300, 130, '📡', 'Routeur'), nd('d', 540, 130, '🖥️', 'Récepteur')], links: [['e', 'r'], ['r', 'd']], steps: s };
    }
  },
  7: {
    o: [sel('md', 'Architecture :', 'cs', [['cs', 'Client-serveur'], ['pc', 'P2P centralisé'], ['pp', 'P2P décentralisé']])],
    g(O) {
      const cl = (id, x, y, l) => nd(id, x, y, '💻', l);
      if (O.md === 'cs') return { nodes: [nd('s', 300, 130, '🖥️', 'Serveur'), cl('a', 80, 50, 'Client 1'), cl('b', 80, 200, 'Client 2'), cl('c', 520, 50, 'Client 3')], links: [['s', 'a'], ['s', 'b'], ['s', 'c']], steps: [
        { f: 'a', t: 's', l: 'film?', m: 'Client 1 demande <b>film.mp4</b> au serveur.' },
        { f: 's', t: 'a', l: 'film', m: 'Le serveur envoie tout le fichier à Client 1.' },
        { f: 'b', t: 's', l: 'film?', m: 'Client 2 fait la même demande : le serveur doit encore tout envoyer.' },
        { f: 's', t: 'b', l: 'film', m: 'Un seul serveur sert tout le monde.' },
        { f: 's', t: 's', l: '⚠', bad: 1, m: 'Si le serveur tombe en panne ou est saturé, plus personne n\'est servi.' }] };
      if (O.md === 'pc') return { nodes: [nd('i', 300, 130, '🗂️', 'Annuaire'), cl('a', 80, 50, 'Pair 1'), cl('b', 80, 200, 'Pair 2'), cl('c', 520, 200, 'Pair 3')], links: [['i', 'a'], ['i', 'b'], ['i', 'c'], ['a', 'b'], ['a', 'c']], steps: [
        { f: 'a', t: 'i', l: 'film?', m: 'Pair 1 demande à l\'<b>annuaire central</b> qui possède film.mp4.' },
        { f: 'i', t: 'a', l: '2,3', m: 'L\'annuaire répond : Pair 2 et Pair 3 l\'ont.' },
        { f: 'b', t: 'a', l: 'part 1', m: 'Pair 2 envoie directement la partie 1 à Pair 1.' },
        { f: 'c', t: 'a', l: 'part 2', m: 'Pair 3 envoie la partie 2. Le fichier ne passe pas par l\'annuaire.' }] };
      return { nodes: [cl('a', 130, 60, 'Pair 1'), cl('b', 470, 60, 'Pair 2'), cl('c', 130, 200, 'Pair 3'), cl('d', 470, 200, 'Pair 4')], links: [['a', 'b'], ['a', 'c'], ['a', 'd'], ['b', 'c'], ['b', 'd'], ['c', 'd']], steps: [
        { f: 'a', t: 'b', l: 'film?', m: 'Pair 1 demande à ses voisins : « Qui a film.mp4 ? »' },
        { f: 'a', t: 'c', l: 'film?', m: 'Il interroge aussi Pair 3 (pas de serveur central).' },
        { f: 'b', t: 'a', l: 'part 1', m: 'Pair 2 envoie la partie 1.' },
        { f: 'c', t: 'a', l: 'part 2', m: 'Pair 3 envoie la partie 2.' },
        { f: 'a', t: 'a', l: '✔', m: 'Aucun serveur central : si un pair s\'éteint, les autres continuent.' }] };
    }
  },
  8: {
    o: [sel('pr', 'Réception :', 'pop3', [['pop3', 'POP3'], ['imap', 'IMAP']]), sel('tx', 'Message de toto :', 'Bonjour Tata !')],
    g(O) {
      const pr = O.pr === 'pop3' ? 'POP3' : 'IMAP';
      return { nodes: [nd('t1', 50, 130, '👤', 'toto', 'toto@free.fr'), nd('s1', 210, 130, '📨', 'SMTP free.fr'), nd('s2', 390, 130, '📨', 'Serveur gmail.com'), nd('t2', 550, 130, '👤', 'tata', 'tata@gmail.com')], links: [['t1', 's1'], ['s1', 's2'], ['s2', 't2']], steps: [
        { f: 't1', t: 's1', l: 'SMTP', m: `Toto écrit « ${esc(O.tx)} » et clique sur Envoyer : le message part vers le serveur <b>SMTP</b> de free.fr.` },
        { f: 's1', t: 's1', l: '🔎', m: 'free.fr cherche le serveur qui gère <b>gmail.com</b> (grâce au DNS).' },
        { f: 's1', t: 's2', l: 'SMTP', m: 'Transmission du message d\'un serveur à l\'autre en SMTP.' },
        { f: 's2', t: 's2', l: '📥', m: 'gmail.com range le message dans la boîte de tata.' },
        { f: 't2', t: 's2', l: pr, m: `Tata ouvre sa messagerie : requête <b>${pr}</b>.` },
        { f: 's2', t: 't2', l: '✉', m: O.pr === 'pop3' ? '<b>POP3</b> : le message est <u>téléchargé</u> sur l\'appareil de tata (et en général supprimé du serveur).' : '<b>IMAP</b> : le message est consulté, il <u>reste sur le serveur</u> et se synchronise sur tous les appareils de tata.' }] };
    }
  }
};

/* ---------- MOTEUR D'ANIMATION ---------- */
function engine(host, def, O) {
  host.innerHTML = '<svg viewBox="0 0 600 260" role="img" aria-label="Simulation"></svg><p class="msg" aria-live="polite"></p><div class="ctl"><button data-a="play">▶ Démarrer</button><button data-a="pause">⏸ Pause</button><button data-a="prev">◀ Précédent</button><button data-a="next">Suivant ▶</button><button data-a="reset">↺ Recommencer</button><select data-a="spd" aria-label="Vitesse"><option value="1.7">Lent</option><option value="1" selected>Normal</option><option value=".5">Rapide</option></select></div>';
  const svg = $('svg', host), msg = $('.msg', host);
  let D, i = -1, tm = null, raf = 0, spd = 1;
  const N = id => D.nodes.find(n => n.id === id);
  const stop = () => { clearInterval(tm); tm = null; };
  function draw(anim) {
    const s = D.steps[i] || {};
    let h = (D.links || []).map(([a, b]) => { const A = N(a), B = N(b); return A && B ? `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>` : ''; }).join('');
    h += D.nodes.map(n => {
      const c = (s.bad && n.id === s.t ? ' bad' : '') + (n.id === s.f || n.id === s.t ? ' on' : '') + (D.sel === n.id ? ' sel' : '');
      return `<g class="nd${c}" data-id="${n.id}"${D.onNode ? ' style="cursor:pointer"' : ''}><circle cx="${n.x}" cy="${n.y}" r="26"/><text x="${n.x}" y="${n.y + 9}" class="em">${n.e}</text>` +
        (n.side ? `<text x="${n.x + 32}" y="${n.y + 5}" class="lb l">${n.l}</text>` : `<text x="${n.x}" y="${n.y + 46}" class="lb">${n.l}</text>` + (n.s ? `<text x="${n.x}" y="${n.y + 60}" class="sb">${n.s}</text>` : '')) + '</g>';
    }).join('');
    h += `<g class="pk${s.bad ? ' bad' : ''}" style="display:none"><rect x="-26" y="-12" width="52" height="24" rx="12"/><text y="5">${esc(s.l || '')}</text></g>`;
    svg.innerHTML = h;
    if (!s.f) return;
    const pk = $('.pk', svg), A = N(s.f), B = N(s.t);
    pk.style.display = '';
    const put = (x, y) => pk.setAttribute('transform', `translate(${x} ${y})`);
    if (A === B) { put(A.x, A.y - 44); return; }
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const x0 = A.x + ux * 38, y0 = A.y + uy * 38, x1 = B.x - ux * 38, y1 = B.y - uy * 38;
    cancelAnimationFrame(raf);
    if (!anim) { put(x1, y1); return; }
    const t0 = performance.now(), du = 1000 * spd;
    const f = t => { const p = Math.min(1, (t - t0) / du); put(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p); if (p < 1) raf = requestAnimationFrame(f); };
    put(x0, y0); raf = requestAnimationFrame(f);
  }
  function go(k, anim) {
    if (D.err) { msg.innerHTML = '⚠️ ' + D.err; return false; }
    if (k < -1 || k >= D.steps.length) return false;
    i = k; draw(anim);
    msg.innerHTML = i < 0 ? 'Appuie sur ▶ Démarrer ou sur Suivant pour commencer.' : `<b>Étape ${i + 1}/${D.steps.length}</b> — ${D.steps[i].m}`;
    return true;
  }
  function load() {
    stop(); cancelAnimationFrame(raf); D = def(O); i = -1; draw(); go(-1);
    if (D.err) msg.innerHTML = '⚠️ ' + D.err;
  }
  svg.onclick = e => { const g = e.target.closest('.nd'); if (g && D.onNode) D.onNode(g.dataset.id); };
  host.onclick = e => {
    const a = e.target.dataset.a; if (!a || a === 'spd') return;
    if (a === 'play') { stop(); if (i >= D.steps.length - 1) i = -1; if (go(i + 1, true)) tm = setInterval(() => { if (!go(i + 1, true)) stop(); }, 2000 * spd); }
    if (a === 'pause') stop();
    if (a === 'next') { stop(); go(i + 1, true); }
    if (a === 'prev') { stop(); go(i - 1, false); }
    if (a === 'reset') load();
  };
  host.onchange = e => { if (e.target.dataset.a === 'spd') spd = +e.target.value; };
  return { reload: load };
}

function mount(host, n) {
  const c = CFG[n], O = {};
  const bar = document.createElement('div'); bar.className = 'opts';
  (c.o || []).forEach(o => {
    O[o.id] = o.d;
    const l = document.createElement('label'); l.textContent = o.l + ' ';
    let f;
    if (o.v) { f = document.createElement('select'); f.innerHTML = o.v.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join(''); }
    else { f = document.createElement('input'); f.type = 'text'; }
    f.value = o.d;
    f.oninput = () => { O[o.id] = f.value; E.reload(); };
    l.append(f); bar.append(l);
  });
  const ex = document.createElement('div'); ex.className = 'extra';
  const sim = document.createElement('div'); sim.className = 'sim';
  host.append(bar, ex, sim);
  const E = engine(sim, c.g, O);
  if (c.x) c.x(ex, E.reload, O);
  E.reload();
}

/* ---------- PAGES ---------- */
const app = $('#app');
const pct = () => Math.round(S.done.length / M.length * 100);
const hero = () => `<svg viewBox="0 0 300 140" aria-hidden="true"><g stroke="#4f8cff" stroke-width="2" fill="none"><path id="p1" d="M40 100 L150 40 L260 100"/><path id="p2" d="M40 100 L260 100"/></g>
<g fill="#fff" stroke="#1e6bff" stroke-width="3"><circle cx="40" cy="100" r="18"/><circle cx="150" cy="40" r="18"/><circle cx="260" cy="100" r="18"/></g>
<g font-size="16" text-anchor="middle"><text x="40" y="106">💻</text><text x="150" y="46">📡</text><text x="260" y="106">🖥️</text></g>
<circle r="6" fill="#fff"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#p1"/></animateMotion></circle><circle r="6" fill="#7fb0ff"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#p2"/></animateMotion></circle></svg>`;

function home() {
  app.innerHTML = `<section class="hero"><div><h1>Internet</h1><p>SNT · Seconde · Mr Turki</p>
<p><b>Ce que tu sauras faire :</b></p><ul><li>Expliquer comment des machines communiquent en réseau</li><li>Lire une adresse IP, un masque, un port</li><li>Décrire le trajet d'une page Web, d'une photo ou d'un mail</li></ul>
<p>⏱ Temps estimé : environ 2 heures, à ton rythme.</p>
<div class="bar" style="width:100%"><i style="width:${pct()}%"></i></div><p>Progression : ${pct()} %</p>
<a class="btn alt" href="#/m/1">Commencer le cours</a>${S.last ? `<a class="btn" href="#/m/${S.last}">Reprendre : module ${S.last}</a>` : ''}<a class="btn" href="#/dash">Voir le sommaire</a></div>${hero()}</section>`;
}
function dash() {
  app.innerHTML = '<h1>Sommaire : 8 modules</h1><div class="cards">' + M.map((m, k) => {
    const st = S.done.includes(k + 1) ? 'done' : S.seen.includes(k + 1) ? 'en cours' : 'à découvrir';
    return `<div class="card${st === 'done' ? ' done' : ''}"><span class="em">${m.i}</span><h2 style="margin:0;font-size:1.2rem">Module ${k + 1} · ${m.t}</h2><p style="margin:0">${m.r}</p><small>${st === 'done' ? '✅ terminé' : st}</small><a class="btn" href="#/m/${k + 1}">Étudier</a></div>`;
  }).join('') + '</div>';
}
function mod(n) {
  const m = M[n - 1];
  S.last = n; if (!S.seen.includes(n)) S.seen.push(n); save();
  const done = S.done.includes(n);
  app.innerHTML = `<p class="crumb"><a href="#/dash">← Sommaire</a> · Module ${n} sur 8</p><h1>${m.i} ${m.t}</h1>` +
    m.n.map(x => `<section class="nt"><h2>${x.h}</h2>
<div class="st"><h3>Je découvre</h3><p>${x.d}</p></div>
<div class="st"><h3>Je comprends</h3><p>${x.c}</p></div>
<div class="st d"><h3>Je retiens</h3><p>${x.k}</p></div>
<div class="st"><h3>Je vérifie (facultatif)</h3><div class="qz" data-a="${x.q[2]}"><p>${x.q[0]}</p>${x.q[1].map((t, k) => `<button data-k="${k}">${t}</button>`).join('')}<span class="fb"></span></div></div></section>`).join('') +
    `<section class="nt"><h2>Je visualise et je manipule</h2><div id="sim"></div></section>
<section class="box"><h2>À retenir</h2>${m.n.map(x => `<p>• ${x.k}</p>`).join('')}<div class="chips">${m.kw.map(k => `<span>${k}</span>`).join('')}</div></section>
<div class="row noprint">${n > 1 ? `<a class="btn" href="#/m/${n - 1}">◀ Module précédent</a>` : '<span></span>'}<button class="b" id="dn">${done ? '✅ Terminé (annuler)' : 'Marquer comme terminé'}</button>${n < 8 ? `<a class="btn" href="#/m/${n + 1}">Module suivant ▶</a>` : '<a class="btn" href="#/fiche">Fiche de révision</a>'}</div><p><a href="#/dash">↩ Retour au sommaire</a></p>`;
  mount($('#sim'), n);
  $('#dn').onclick = () => { S.done = done ? S.done.filter(v => v !== n) : [...S.done, n]; save(); mod(n); head(); };
}
function fiche() {
  app.innerHTML = `<h1>Fiche de révision : Internet</h1><p class="noprint">Pour l'enregistrer en PDF : clique sur le bouton, puis choisis « Enregistrer au format PDF » comme imprimante.</p><button class="b noprint" onclick="window.print()">🖨 Imprimer / PDF</button>` +
    M.map((m, k) => `<section class="box"><h2>${m.i} ${k + 1}. ${m.t}</h2>${m.n.map(x => `<p>• ${x.k}</p>`).join('')}<div class="chips">${m.kw.map(w => `<span>${w}</span>`).join('')}</div></section>`).join('') +
    '<section class="box"><h2>Synthèse</h2><p>Des appareils reliés par des switchs forment un réseau local. Les routeurs relient les réseaux entre eux : c\'est Internet. Chaque machine a une adresse IP (+ un port pour viser un service). Le DNS traduit les noms en IP. TCP découpe, numérote, vérifie et réassemble les paquets. Le courrier utilise SMTP pour envoyer et POP3 ou IMAP pour recevoir.</p></section>';
}
function head() { $('#gb').style.width = pct() + '%'; $('#gt').textContent = pct() + ' %'; }

function route() {
  const h = location.hash.slice(1) || '/', m = h.match(/^\/m\/([1-8])$/);
  if (m) mod(+m[1]); else if (h === '/dash') dash(); else if (h === '/fiche') fiche(); else home();
  head(); window.scrollTo(0, 0);
}
app.addEventListener('click', e => {
  const b = e.target.closest('.qz button'); if (!b) return;
  const q = b.closest('.qz'), ok = +b.dataset.k === +q.dataset.a;
  q.querySelectorAll('button').forEach(x => x.classList.remove('ok', 'ko'));
  b.classList.add(ok ? 'ok' : 'ko');
  q.querySelector('.fb').textContent = ok ? '✅ Bravo !' : '❌ Pas tout à fait : relis « Je comprends » et réessaie.';
});
$('#fs').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
window.addEventListener('hashchange', route);
route();
