			function updateInputLength() {
				var value = document.getElementById('input').value;

				document.getElementById("length").textContent = value.length;
				//document.getElementById("value").textContent = value;
			}


			function addCharacterToCursorPosition(char) {
				var textarea = document.getElementById("input");
				var textareaStart = textarea.selectionStart;				

				textarea.value = textarea.value.substr(0, textarea.selectionStart) + char + textarea.value.substr(textarea.selectionEnd);
				updateInputLength();

				textarea.focus();
				textarea.setSelectionRange(textareaStart+char.length, textareaStart+char.length);
				//textarea.createTextRange(textareaStart, textareaStart);

				
			}

			function fixedFromCharCode (codePt) {  
				if (codePt > 0xFFFF) {  
					codePt -= 0x10000;  
					return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));  
				}  
				else {  
					return String.fromCharCode(codePt);  
				}  
			}  

			function addButton(item) {
				
				var element;
				element = document.createElement("button");

				var char = null;
				if ('undefined' != typeof item['character'])     char = item['character'];
				else if ('undefined' != typeof item['charcode']) char = fixedFromCharCode(item['charcode']);
				else return;

				element.addEventListener('click', function(){addCharacterToCursorPosition(char)}); 

				if ('undefined' != typeof item['caption']) element.textContent = item['caption'];
				else element.textContent = char;

				var title = item['title'];
				if ('undefined' != typeof title) element.setAttribute('title', title);
				
				var description = item['description'];
				if ('undefined' != typeof description && description != "") element.setAttribute('title', title +" ("+ description +")");

				//document.getElementById("buttons").appendChild(element);
				return element;
			}

			/*function addButtons(buttonsArray) {	        
				if ('undefined' != typeof buttonsArray['name']) {
					var h2 = document.createElement("h2");
					h2.textContent = buttonsArray['name'];
					document.getElementById("buttons").appendChild(h2);
				}
				else addButtonsSeparator();

				for (var i in buttonsArray['content']) addButton(buttonsArray['content'][i]);  
			}*/
			
			
			function addButtons(buttonsArray) {
			    var categories = ["cat1", "cat2", "cat3", "cat4"];
                for (var i in buttonsArray['content']) {
                    var element = addButton(buttonsArray['content'][i]);  
                    
                    var category = "buttons-category";
                    

                    
                    for (var cat in categories) {
                        if (buttonsArray['content'][i][categories[cat]] != "" && 'undefined' != typeof buttonsArray['content'][i][categories[cat]]) 
                            category += "-"+ buttonsArray['content'][i][categories[cat]];
                        //console.log(cat + " // "+ buttonsArray['content'][i][categories[cat]]);   
                    }
                    
                    if (!document.getElementById(category))  {
                        container = document.createElement('div');
                        
                        var title = "";
                        for (var cat in categories) {
                            if (buttonsArray['content'][i][categories[cat]] != "" && 'undefined' != typeof buttonsArray['content'][i][categories[cat]]) {
                                if (cat > 0) title +=" » ";
                                title += buttonsArray['content'][i][categories[cat]];
                            }
                        }
                        
                        container.id = category;
                        
                        var h2 = document.createElement('h2');
                        h2.textContent = title;
                        container.appendChild(h2);
                        
                        document.getElementById('buttons').appendChild(container);
                        
                    }
                    
                    document.getElementById(category).appendChild(element);
                    
                }
			}

			function addButtonsSeparator() {
				document.getElementById("buttons").appendChild(document.createElement("hr"));
			}
			
			function loadFileList(filename) {
			    var list = null;
			    document.getElementById('blockSelection').disabled = true;
			    
			    var http_request = new XMLHttpRequest();
			    http_request.open("GET", filename, true);
			    http_request.onreadystatechange = function() {
			        var done = 4, ok = 200;
			        if (http_request.readyState == done && http_request.status == ok) {
			            list = JSON.parse(http_request.responseText);
			            
			            for (var i in list) {
			                addOption(list[i]);
			            }
			        }
					else if (http_request.readyState == done && http_request.status != ok) 
						window.alert ("Unable to load file "+ filename +", returned error code "+ http_request.status);
				}
				http_request.send(null);
				
				document.getElementById('blockSelection').disabled = false  ;
			}    

            function addOption(item) {
                element = document.createElement('option');
                element.value = item['filename'];
                element.textContent = item['title']
                document.getElementById('blockSelection').appendChild(element)
            }

			function loadCharactersMap(filename) {
			
			    var stateObj = { 'charMap': filename };
                history.pushState(stateObj, filename, "?load="+ filename);
			
			
				var list = null;

				var http_request = new XMLHttpRequest();
				http_request.open("GET", "res/"+ filename, true);
				http_request.onreadystatechange = function () {
					var done = 4, ok = 200;
					if (http_request.readyState == done && http_request.status == ok) {
						list = JSON.parse(http_request.responseText);

                        debug_list = list; /// DEBUG
                        
						for (var i in list) {
							addButtons(list[i]);
						}
					}
					else if (http_request.readyState == done && http_request.status != ok) 
						window.alert ("Unable to load file "+ filename +", returned error code "+ http_request.status);
				}
				http_request.send(null);
			}

            var debug_list;            /// DEBUG

			function getQueryString() {
				var queryString={};
				if (window.location.search.length > 1) {
					var list = window.location.search.slice(1).split('&');
					for (var item in list) {    
						var keyval = list[item].split('=');
						queryString[keyval[0]] = keyval[1];
					}
				}
				return queryString;
			}

            function loadSelectedBlock(node) {
                var index = node.selectedIndex;
                if (node.options[index].value != "") {
                    removeButtons();
                    loadCharactersMap(node.options[index].value);
                }
                //else window.alert("No block selected.");
            }
            
            function removeButtons() { 
                document.getElementById('buttons').textContent = '';
            }
            
            function loadCharactersFile(filename) { // The other way around 
                removeButtons();
                loadCharactersMap(filename);
            }
            
			function start() { 
				updateInputLength();
				loadFileList('res/list.json');
				var queryString = getQueryString();				
				
				var filename = queryString['load'];
				if (filename) {
				    removeButtons();
				    loadCharactersMap(filename.slice(filename.lastIndexOf('/')+1));
				}
				else loadSelectedBlock(document.getElementById('blockSelection'));
			}

            function changeListStyle(style) {
                document.getElementById('buttons').className = style;
            }
            
            
	function loadCSSFile(CSSFile, id) {
		var e = document.createElement('link');
		e.rel='stylesheet';
		e.type = 'text/css';
		e.href=CSSFile;
		
		if (id != undefined) {
			e.id=id;
			removeElement(id)
		}
		
		var head = document.getElementsByTagName("head")[0]; 
		head.appendChild(e);
	}
	
	function removeElement(id) {
		var element = document.getElementById(id);
		if (element != null) element.parentNode.removeChild(element);
	}
