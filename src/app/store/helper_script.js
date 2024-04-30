

function obj2htmlAngular(obj, target)
{
	target.appendChild(obj2html(JSON.parse(obj)))
}
function obj2html(obj) {
	if (typeof obj !== 'object') {
		var p = document.createElement('p');
		p.innerText = obj;
		return p;
	}

	if (obj instanceof Array) {
		var table = document.createElement('table');
		obj.forEach(function(element) {
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.appendChild(obj2html(element));
			tr.appendChild(td);
			table.appendChild(tr);
		});
		return table;
	}

	if (obj instanceof Object) {
		var iterator = Object.keys(obj);
		var table = document.createElement('table');
		for (var key of iterator) {
			var tr = document.createElement('tr');
			var th = document.createElement('th');
			th.innerText = key;
			tr.appendChild(th);
			var td = document.createElement('td');
			td.appendChild(obj2html(obj[key]));
			tr.appendChild(td);
			table.appendChild(tr);
		}
		return table;
	}
}


function createFilterElement(name) {
	const filterElementString = `
		<div class="filterExpandableButton">
			<div class="filterExpandableButtonTitle">
				<span>${name}</span>
			</div>
			<div class="filterExpandableButtonContent"></div>
		</div>
	`;

	const filterContainer = document.createElement('div');
	filterContainer.classList.add('filterExpandableButtonsArea');
	filterContainer.innerHTML = filterElementString;

	return filterContainer;
}

function addFilter(name, {isSlider, sliderMin=1, sliderMax=10, values, formatter=x=>x})
{
	const filterArea = document.body.getElementsByClassName("categoryArea")[0];
	//const newBtn = btn.cloneNode(true);
	const newBtn = createFilterElement(name);
	const titleElement = newBtn.querySelector('.filterExpandableButtonTitle span');
	titleElement.textContent = name;
	
	const content = newBtn.querySelector('.filterExpandableButtonContent');

	if(isSlider)
	{
		const sliderElement = document.createElement('input');
		sliderElement.setAttribute('type', 'range');
		sliderElement.setAttribute('min', sliderMin);
		sliderElement.setAttribute('max', sliderMax);
		content.appendChild(sliderElement);

		// Create a text node to display the current value
		const valueText = document.createElement("div");
		content.appendChild(valueText);
		valueText.textContent = formatter(sliderElement.value);

		// Update the text value when the slider value changes
		sliderElement.addEventListener('input', function() {
			valueText.textContent = formatter(this.value);
		});
	}
	else
	{
		const selectElement = document.createElement('select');
		selectElement.setAttribute('size', 6)
		values.forEach(value => {
			const option = document.createElement('option');
			option.value = value;
			option.textContent = value;
			selectElement.appendChild(option);
		});
		content.appendChild(selectElement);
	}
	
	filterArea.insertBefore(newBtn, filterArea.lastChild);

	newBtn.addEventListener('mouseenter', function(e)
	{
		content.style.height = '150px'
	})
	newBtn.addEventListener('mouseleave', function(e)
	{
		content.style.height = 0
	})
}