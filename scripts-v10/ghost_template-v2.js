function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

evi_color = {
    "EMF 5": "#db4d48",
    "DOTs": "#2ccc29",
    "Ultraviolet": "#ad8ce7",
    "Freezing": "#9ae0f7",
    "Ghost Orbs": "#dbd993",
    "Writing": "#4d8ce3",
    "Spirit Box": "#d18c5e", 
}

evi_icons = {
    "EMF 5": "imgs/emf5-icon.png",
    "DOTs": "imgs/dots-icon.png",
    "Ultraviolet": "imgs/fingerprints-icon.png",
    "Freezing": "imgs/freezing-icon.png",
    "Ghost Orbs": "imgs/orbs-icon.png",
    "Writing": "imgs/writing-icon.png",
    "Spirit Box": "imgs/spirit-box-icon.png", 
}

has_los_guide = [
    "The Twins",
    "Raiju",
    "Revenant",
    "Hantu",
    "Moroi",
    "Thaye",
    "The Mimic",
    "Deogen"
]

class Ghost {
    constructor(data,evidence){
        mquery = window.matchMedia("screen and (pointer: coarse) and (max-device-width: 600px)")

        // [fork] EVIDENCE-FIRST card (.gcard2). Keeps .ghost_card + all data-carrier
        // hooks so filter-v15 / metronome / search / wslink keep working.
        const isMimic = data.ghost === 'The Mimic';
        const eviKeys = data.evidence.slice(0, 3).concat(isMimic ? ['Ghost Orbs'] : []);
        const eviTiles = eviKeys.map(k => `
            <div class="ghost_evidence_item g2-evi" name="${k}" style="--evi:${(typeof evi_color !== 'undefined' && evi_color[k]) || '#888'}">
              <span class="g2-evi-ic"><img src="${(typeof evi_icons !== 'undefined' && evi_icons[k]) || ''}" alt=""></span>
              <span class="g2-evi-lbl">${(evidence && evidence[k]) || k}</span>
            </div>`).join('');

        let speedStr;
        if (data.min_speed == -1) { speedStr = '??? m/s'; }
        else {
            const sep = (+data.speed_is_range) ? ' - ' : ' | ';
            speedStr = this.toNumStr(data.min_speed) + ' m/s';
            if (data.max_speed != null) speedStr += sep + this.toNumStr(data.max_speed) + ' m/s';
            if (data.alt_speed != null) speedStr += ' (' + this.toNumStr(data.alt_speed) + ' m/s)';
        }
        const sanityStr = parseInt(data.hunt_sanity) == -1 ? '???%' : data.hunt_sanity;

        // [fork] per-card footstep play buttons — hear the cadence at each of this ghost's speeds
        var stepSpeeds = [];
        if (data.min_speed != -1) {
            stepSpeeds.push(+data.min_speed);
            if (data.max_speed != null && +data.max_speed !== +data.min_speed) stepSpeeds.push(+data.max_speed);
            if (data.alt_speed != null && stepSpeeds.indexOf(+data.alt_speed) === -1) stepSpeeds.push(+data.alt_speed);
        }
        var stepsBtns = stepSpeeds.map(function (s) {
            return '<button type="button" class="g2-steps" title="Oír los pasos a ' + s + ' m/s" ' +
                'onclick="event.stopPropagation(); stPlayRef(' + s + ', this)">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button>';
        }).join('');

        const intel = (typeof GHOST_INTEL !== 'undefined') ? GHOST_INTEL[data.ghost] : null;
        let weak = '—', strong = '—';
        if (intel && !intel.datamined) { weak = intel.w; strong = intel.s; }
        else if (intel && intel.datamined) { weak = 'Sin confirmar'; strong = 'Fantasma datamined (no confirmado en el juego en vivo).'; }

        const bh = (typeof GHOST_BEHAVIOR !== 'undefined') ? GHOST_BEHAVIOR[data.ghost] : null;
        const sight = (bh && bh.sight) || 'Normal';
        const hearing = (bh && bh.hearing) || 'Normal';
        const light = (bh && bh.light) || 'Normal';
        const movement = (bh && bh.movement) || ('Normal (' + (data.min_speed == -1 ? '???' : this.toNumStr(data.min_speed)) + ' m/s)');
        const huntPhrase = (bh && bh.hunt) || ('Caza desde ' + sanityStr);
        const tip = (bh && bh.survivalTip) || '';
        const st = (v) => (v && !/^\s*normal/i.test(v)) ? 'alert' : 'normal';

        // off-screen carrier: keeps text search (behavior + survival) and the
        // shared-journal link (reads .ghost_behavior) working without showing a wall of text.
        const searchText = `${this.behavior(data.wiki)} ${sight} ${hearing} ${light} ${movement} ${huntPhrase} ${tip} ${weak} ${strong}`;

        this.ghostTemplate = `
        <div class="gcard2 ghost_card" id="${data.ghost}">
            ${data.ghost == 'Obambo' ? '<img id="obambo_timer_button" src="imgs/stopwatch-off.png" onclick="toggle_obambo_timer()" alt="Toggle Obambo state timer">' : ''}

            <header class="g2-head">
                <h3 class="ghost_name g2-name" onclick="toggleGhostExpand(this)">${data.name}</h3>
                <button class="g2-more" type="button" onClick="openGhostInfo('${data.ghost}')">
                    <span class="g2-more-txt">{{0_evidence_tests}}</span>
                    <svg class="g2-more-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
                </button>
            </header>

            <div class="ghost_evidence g2-evidence" onclick="toggleGhostExpand(this)">${eviTiles}
            </div>

            <div class="g2-intel">
                <div class="g2-irow g2-weak">
                    <span class="g2-imark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"/></svg></span>
                    <span class="g2-ibody"><span class="g2-ilabel">Debilidad</span><span class="g2-ivalue">${weak}</span></span>
                </div>
                <div class="g2-irow g2-strong">
                    <span class="g2-imark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20V9m0 0l-4 4m4-4l4 4M5 4h14"/></svg></span>
                    <span class="g2-ibody"><span class="g2-ilabel">Fuerza</span><span class="g2-ivalue">${strong}</span></span>
                </div>
            </div>

            <div class="g2-move">
                <div class="g2-stat g2-stat-speed">
                    <span class="g2-stat-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h9m0 0l-3-3m3 3l-3 3M14 5l5 7-5 7"/></svg></span>
                    <span class="g2-stat-body"><span class="g2-stat-lbl">Velocidad</span><span class="ghost_speed g2-stat-val">${speedStr}</span></span>
                    <span class="g2-steps-group" title="Escuchar los pasos">${stepsBtns}</span>
                </div>
                <div class="g2-stat g2-stat-sanity">
                    <span class="g2-stat-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3C9 7 6 9 6 13a6 6 0 0012 0c0-4-3-6-6-10z"/></svg></span>
                    <span class="g2-stat-body"><span class="g2-stat-lbl">Caza desde</span><span class="g2-stat-val">${sanityStr}</span></span>
                </div>
            </div>

            <div class="g2-chips">
                <span class="g2-chip g2-chip-sight" data-state="${st(sight)}" title="${sight.replace(/"/g,'&quot;')}"><svg class="g2-chip-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.6"/></svg><span class="g2-chip-txt">${sight}</span></span>
                <span class="g2-chip g2-chip-hear" data-state="${st(hearing)}" title="${hearing.replace(/"/g,'&quot;')}"><svg class="g2-chip-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0112 0c0 4-4 4-4 7a3 3 0 01-6 0"/><path d="M9 13a3 3 0 016 0"/></svg><span class="g2-chip-txt">${hearing}</span></span>
                <span class="g2-chip g2-chip-light" data-state="${st(light)}" title="${light.replace(/"/g,'&quot;')}"><svg class="g2-chip-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6m-5 3h4M12 2a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z"/></svg><span class="g2-chip-txt">${light}</span></span>
            </div>

            <input class="g2-hunt-toggle" type="checkbox" id="hunt-${data.ghost.replace(/\s+/g,'-')}" hidden>
            <label class="g2-hunt-btn" for="hunt-${data.ghost.replace(/\s+/g,'-')}">
                <span class="g2-hunt-dot" aria-hidden="true"></span>
                <span class="g2-hunt-btn-txt">MODO CACER&Iacute;A</span>
                <svg class="g2-hunt-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </label>
            <div class="g2-hunt"><div class="g2-hunt-inner">
                <div class="g2-hunt-grid">
                    <div class="g2-hcell" data-state="${st(sight)}"><svg class="g2-hcell-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.6"/></svg><span class="g2-hcell-lbl">Vista</span><span class="g2-hcell-val">${sight}</span></div>
                    <div class="g2-hcell" data-state="${st(hearing)}"><svg class="g2-hcell-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0112 0c0 4-4 4-4 7a3 3 0 01-6 0"/><path d="M9 13a3 3 0 016 0"/></svg><span class="g2-hcell-lbl">O&iacute;do</span><span class="g2-hcell-val">${hearing}</span></div>
                    <div class="g2-hcell" data-state="${st(light)}"><svg class="g2-hcell-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6m-5 3h4M12 2a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z"/></svg><span class="g2-hcell-lbl">Luz</span><span class="g2-hcell-val">${light}</span></div>
                    <div class="g2-hcell g2-hcell-move"><svg class="g2-hcell-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h9m0 0l-3-3m3 3l-3 3M14 5l5 7-5 7"/></svg><span class="g2-hcell-lbl">Movimiento</span><span class="g2-hcell-val">${movement}</span></div>
                </div>
                <div class="g2-tip"><svg class="g2-tip-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6m-5 3h4M12 2a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z"/></svg><span class="g2-tip-txt"><b>Sobrevivir:</b> ${tip}</span></div>
                <div class="g2-hunt-meta"><span class="g2-hunt-pill"><b>Velocidad</b> ${speedStr}</span><span class="g2-hunt-pill"><b>${huntPhrase}</b></span></div>
            </div></div>

            <div class="g2-clear ghost_clear">
                <img class="card_icon card_icon_select" title="{{select_ghost}}" src="imgs/select.png" onclick="select(this.parentElement.parentElement)">
                <img class="card_icon card_icon_guess" title="{{guess_ghost}}" style="display:none;" src="imgs/guess.png" onclick="guess(this.parentElement.parentElement)">
                <img class="card_icon card_icon_not" title="{{not_ghost}}" src="imgs/not.png" onclick="fade(this.parentElement.parentElement)" ondblclick="remove(this.parentElement.parentElement)">
                <img class="card_icon card_icon_died" title="{{died_to_ghost}}" style="display:none;" src="imgs/died.png" onclick="died(this.parentElement.parentElement)">
            </div>
            <div class="ghost_guesses"></div>

            <div class="ghost_behavior" style="position:absolute;left:-99999px;top:0;width:260px;" aria-hidden="true">${searchText}</div>
            <div class="ghost_nightmare_evidence" style="display:none">${data.nightmare_evidence?data.nightmare_evidence:''}</div>
            <div class="ghost_hunt_high" style="display:none">${data.hunt_sanity_high}</div>
            <div class="ghost_hunt_low" style="display:none">${data.hunt_sanity_low}</div>
            <div class="ghost_has_los" style="display:none">${+data.has_los}</div>
            <div class="ghost_speed_values" style="display:none">${speedStr}</div>
        </div>
        `

        this.wikiTemplate = `
        <div id="wiki-0-evidence-${data.ghost.replace(" ","-").toLowerCase()}" class="wiki_title accordian" onclick="accordian(this)"><div class="wiki_subtitle"><div class="wiki_crumb">&#9500;</div> ${data.name}</div></div>
        <div class="wiki_details" style="height: 0px;">
            <div class="text">
                <p><b>{{abilities_behaviors_tells}}</b></p>
                ${Object.keys(data.wiki).length > 0 ? this.build_tells(data.wiki["tells"],data.wiki["behaviors"],data.wiki["abilities"]) : ""}
                <p><b>{{confirmation_tests}}</b> †</p>
                ${Object.keys(data.wiki).length > 0 ? this.build_confirmation_tests(data.ghost,data.name,data.wiki["confirmation_tests"]) : ""}
                <p><b>{{elimination_tests}}</b></p>
                ${Object.keys(data.wiki).length > 0 ? this.build_elimination_tests(data.ghost,data.name,data.wiki["elimination_tests"]) : ""}
                <div class="wiki_details_note">
                    <i>{{use_bpm_finder}}</i>
                    <i>{{use_map_explorer}}</i>
                    <i style="opacity: 0.4; margin-top: 3px;">† {{mimic_disclaimer}}</i>
                </div>
            </div>
            <div onclick="generateWikiShareLink(this);" class="wiki-share">{{copy_share_link}} <img loading="lazy" src="imgs/share.png"></div>
        </div>
        `
    }

    build_evidence_item(evidence,evidence_name,wordless=false){
        
        return `<div class="ghost_evidence_item" ${evidence in evi_color ? 'style=\"color:' + evi_color[evidence] + ' !important;\"' : ''} name="${evidence}"><img src="${evi_icons[evidence]}">${wordless ? '' : evidence_name}</div>`
    }

    build_tells(tells,behavior,abilities){
        var data = "<ul>"

        for(var i in tells){
            if(tells[i]["is_0_evi"]){
                data += `<li><b>{{tell}}</b>: ${tells[i]["data"]}`
                if(tells[i].hasOwnProperty("note"))
                    data += `<br><i>{{note}}: ${tells[i]["note"]}</i>`
                data += "</li>"
            }
        }

        for(var i in behavior){
            if(behavior[i]["is_0_evi"]){
                data += `<li><b>{{behavior}}</b>: ${behavior[i]["data"]}</li>`
                if(behavior[i].hasOwnProperty("note"))
                    data += `<br><i>{{note}}: ${behavior[i]["note"]}</i>`
                data += "</li>"
            }
        }

        for(var i in abilities){
            if(abilities[i]["is_0_evi"]){
                data += `<li><b>{{ability}}</b>: ${abilities[i]["data"]}</li>`
                if(abilities[i].hasOwnProperty("note"))
                    data += `<br><i>{{note}}: ${abilities[i]["note"]}</i>`
                data += "</li>"
            }
        }

        data += "</ul>"
        return data
    }

    build_confirmation_tests(ghost,ghost_name,value){
        var data = "<ul>"

        if(value.length == 0){
            data += `<li class="non-definitive"><i>({{no_confirmation_tests,${ghost_name}}})</i></li>`
        }

        for(var i in value){
            data += `<li${value[i]["definitive"] ? "" : " class=\"non-definitive\""}><b>{{${value[i]["type"].toLowerCase().replace(' ','_')}}} (${value[i]["definitive"] ? "{{definitive}}" : "{{non_definitive}}"})</b>: ${value[i]["data"]}`

            if(value[i]["image"] != null){
                if(Array.isArray(value[i]["image"])){
                    value[i]["image"].forEach(img => {
                        data += `<br><img loading="lazy" class="zoomable" src="${img}" onclick="zoomImage(this)">`
                    });
                }
                else{
                    data += `<br><img loading="lazy" class="zoomable" src="${value[i]["image"]}" onclick="zoomImage(this${value[i].hasOwnProperty("subtitle") ? ",'"+value[i]['subtitle']+"'" : ""})">`
                }
            }

            if(value[i]["definitive"])
                data += `<div class="wiki_mark_ghost" onclick='select(document.getElementById("${ghost}"))'>&#x2714; {{mark_ghost}}</div>`
            
            data += `</li>`
        }

        data += "</ul>"
        return data
    }

    build_elimination_tests(ghost,ghost_name,value){
        var data = "<ul>"

        if(value.length == 0){
            data += `<li class="non-definitive"><i>({{no_elimination_tests,${ghost_name}}})</i></li>`
        }

        for(var i in value){
            data += `<li><b>{{${value[i]["type"].toLowerCase().replace(' ','_')}}}</b>: ${value[i]["data"]}`

            if(value[i]["image"] != null){
                if(Array.isArray(value[i]["image"])){
                    value[i]["image"].forEach(img => {
                        data += `<br><img loading="lazy" class="zoomable" src="${img}" onclick="zoomImage(this)">`
                    })
                }
                else{
                    data += `<br><img loading="lazy" class="zoomable" src="${value[i]["image"]}" onclick="zoomImage(this)">`
                }
            }

            data += `<div class="wiki_mark_ghost" onclick='fade(document.getElementById("${ghost}"))'>&#x2717; {{mark_ghost}}</div></li>`
        }

        data += "</ul>"
        return data
    }

    intel(ghost){
        var d = (typeof GHOST_INTEL !== 'undefined') ? GHOST_INTEL[ghost] : null;
        if(!d) return '';
        if(d.datamined){
            return `<div class="ghost_intel datamined">
                <span class="gi_dm_mark" aria-hidden="true">&#9888;</span>
                <span class="gi_dm_text">Fantasma datamined (no confirmado en el juego en vivo)</span>
            </div>`;
        }
        return `<div class="ghost_intel">
            <div class="gi_row gi_weak">
                <span class="gi_mark" aria-hidden="true"><span class="gi_glyph">&#9660;</span></span>
                <span class="gi_body">
                    <span class="gi_label">Debilidad</span>
                    <span class="gi_value">${d.w}</span>
                </span>
            </div>
            <div class="gi_row gi_strong">
                <span class="gi_mark" aria-hidden="true"><span class="gi_glyph">&#9650;</span></span>
                <span class="gi_body">
                    <span class="gi_label">Fuerza</span>
                    <span class="gi_value">${d.s}</span>
                </span>
            </div>
        </div>`;
    }

    behavior(value){
        var msg = "<div class='ghost_behavior_item'>"
        var opened = false

        // Load Tells
        for(var s of ["tells","behaviors","abilities","hunt_sanity","hunt_speed","evidence"]){
            if(value[s] != null){
                opened = false
                for(var i = 0; i < value[s].length;i++){
                    if(value[s][i]["include_on_card"]){
                        if(i == 0){
                            opened = true
                            msg += `<div class='dtitle'><i>{{${(s)}}}</i><div class='ddash'></div></div><ul>`
                        }
                        msg += `<li>${value[s][i]["data"]}</li>`
                    }
                }
                if(opened)
                msg += "</ul>"
            }
        }

        msg += "</div>"
        return msg
    }

    toNumStr(num) { 
        let new_num = Number(num);

        if (Number.isInteger(new_num)) { 
            new_num = new_num.toFixed(1); // 1 → "1.0"
        } else {
            new_num = Number(new_num.toFixed(2)).toString(); // round + trim
        }

        return lang_currency.includes(lang)
            ? new_num.replace(".", ",")
            : new_num;
    }
}