// Targeting server
var endpoint = 'https://sohoc.one';

// Enter for submit		
$(document).on('keydown', function(event) {
	if (event.keyCode === 13) {
		$('#btn_submit').click();
	}
});


	// Set global variable for audio and data
	var audios = [];
	var mainData = {};

	// bind the audio source to #AUDIOPLAYER
	function setAudio() {
		let audio = $("#AUDIOPLAYER")[0];
		$('#AUDIOPLAYER source').each(function(num,val){
			$(this).remove();
		});

		if (audios.length > 0) {
			var source= document.createElement('source');
			source.src= endpoint + mainData['SoDuongDoi_Audio2'];
			audio.appendChild(source);
			
			audio.addEventListener('ended',function(){
				audio.src = endpoint + mainData['SoLinhHon_Audio'];
				audio.pause();
				audio.load();
				audio.play();
			});
		}
	}

	// Get audio data based on API calculation
	function getAudios(data) {
		mainData = data;
		// get all audio paths
		Object.keys(data).map(t => {
			if (t.includes('_Audio') && data[t] !== '') {
				audios.push({
					[t]: data[t].split(',').filter(t => t !== '').map(t => t)
				});
			}
		});
		
		setAudio();
	}
	
	// Extract reusable functions
	function formatNumber(num) {
	  return num.toString().padStart(2, '0');
	}

	// Extract data from form
	function getFormData() {
	  const fullName = $('input[name="name"]').val();
	  const day = formatNumber(parseInt($('input[name="input_day"]').val()));
	  const month = formatNumber(parseInt($('input[name="input_month"]').val()));
	  const year = formatNumber(parseInt($('input[name="input_year"]').val()));
	  const dateOfBirth = `${day}/${month}/${year}`;
	  
	  const pynBaseDay = day;
	  const pynBaseMonth = month;
	  const pynBaseYear = year;

	  return { fullName, dateOfBirth, pynBaseDay, pynBaseMonth, pynBaseYear };
	}

	// Submit the form to server
	function submitForm() {
		const { fullName, dateOfBirth } = getFormData();
		if(fullName && dateOfBirth) {
			$.ajax({
				url: endpoint + '/Customer/FreeBookText',
				method: 'POST',
				data: { fullName, dateOfBirth },
				success: function(res) {
					bindData(res.data);
					$('html, body').animate({scrollTop: $('#REPORT').offset().top}, 500);
				}
			});
		}
		prepareChartData();
		setZodiac();
	}

	// Attach click event listener to submit button
	$('#btn_submit').click(submitForm);

	function bindData(data) {
			if(data) {
				//audio duong dời
				var soDuongDoiAudio = document.getElementById("AUDIOPLAYER-DUONGDOI");
				if (data['SoDuongDoi_Audio2'] && soDuongDoiAudio) {
					soDuongDoiAudio.src = endpoint + data['SoDuongDoi_Audio2'];
				}
				var audio = document.getElementById('AUDIOPLAYER');
				if (audio) {
					audio.load();
					audio.pause();
					audio.currentTime = 0;
					getAudios(data);
				}
				
				// Contents of Report
				const selectors = {
					'[id^="report_baomat_content"]': 'SoDiemBaoMat_Content',
					'[id^="report_bosung_content"]': 'SoBoSung_Content',
					'[id^="report_camxuc_content"]': 'SoTuDuyCamXuc_Content',
					'[id^="report_canbang_content"]': 'SoCanBangTen_Content',
					'[id^="report_changduongdoi1_content"]': 'SoChangDuongDoi_num_content_1',
					'[id^="report_changduongdoi2_content"]': 'SoChangDuongDoi_num_content_2',
					'[id^="report_changduongdoi3_content"]': 'SoChangDuongDoi_num_content_3',
					'[id^="report_changduongdoi4_content"]': 'SoChangDuongDoi_num_content_4',
					'[id^="report_chuky_content"]': 'SoChuKyVongDoi_Content',
					'[id^="report_ddsm_content"]': 'SoKetNoi1_Content',
					'[id^="report_duongdoi_content"]': 'SoDuongDoi_Content',
					'[id^="report_duongdoi2_content"]': 'SoDuongDoi2_Content',
					'[id^="report_logic_content"]': 'SoTuDuyLogic_Content',
					'[id^="report_namcanhan_content"]': 'SoNamSinh_Content',
					'[id^="report_namcanhan1_content"]': 'SoNamSinh1_Content',
					'[id^="report_namcanhan2_content"]': 'SoNamSinh2_Content',
					'[id^="report_namcanhan3_content"]': 'SoNamSinh3_Content',
					'[id^="report_namcanhan4_content"]': 'SoNamSinh4_Content',
					'[id^="report_namcanhan5_content"]': 'SoNamSinh5_Content',
					'[id^="report_ngaycanhan_content"]': 'SoNgayCaNhan_Content',
					'[id^="report_ngaycanhan1_content"]': 'SoNgayCaNhan_Content_1',
					'[id^="report_ngaycanhan2_content"]': 'SoNgayCaNhan_Content_2',
					'[id^="report_ngaycanhan3_content"]': 'SoNgayCaNhan_Content_3',
					'[id^="report_ngaycanhan4_content"]': 'SoNgayCaNhan_Content_4',
					'[id^="report_ngaycanhan5_content"]': 'SoNgayCaNhan_Content_5',
					'[id^="report_ngaycanhan6_content"]': 'SoNgayCaNhan_Content_6',
					'[id^="report_ngaycanhan7_content"]': 'SoNgayCaNhan_Content_7',
					'[id^="report_ngaysinh_content"]': 'SoNgaySinh_Content',
					'[id^="report_noicam_content"]': 'SoNoiCam_Content',
					'[id^="report_noitam_content"]': 'SoLinhHon_Content',
					'[id^="report_nonghiep_content"]': 'SoNoNghiep_Content',
					'[id^="report_nttt_content"]': 'SoKetNoi2_Content',
					'[id^="report_solap_content"]': 'SoLap_Content',
					'[id^="report_sothieu_content"]': 'SoThieu_Content',
					'[id^="report_sumenh_content"]': 'SoSuMenh_Content',
					'[id^="report_tenrieng_content"]': 'SoTenRieng_Content',
					'[id^="report_thachthuc1_content"]': 'SoThachThuc_Content_1',
					'[id^="report_thachthuc2_content"]': 'SoThachThuc_Content_2',
					'[id^="report_thachthuc3_content"]': 'SoThachThuc_Content_3',
					'[id^="report_thachthuc4_content"]': 'SoThachThuc_Content_4',
					'[id^="report_thaido_content"]': 'SoThaiDo_Content',
					'[id^="report_thangcanhan_content"]': 'SoThangCaNhan_Content',
					'[id^="report_thangcanhan1_content"]': 'SoThangCaNhan1_Content',
					'[id^="report_thangcanhan2_content"]': 'SoThangCaNhan2_Content',
					'[id^="report_thangcanhan3_content"]': 'SoThangCaNhan3_Content',
					'[id^="report_thangcanhan4_content"]': 'SoThangCaNhan4_Content',
					'[id^="report_thangcanhan5_content"]': 'SoThangCaNhan5_Content',
					'[id^="report_thehe_content"]': 'SoTheHe_Content',
					'[id^="report_tiemthuc_content"]': 'SoPhanHoiTiemThuc_Content',
					'[id^="report_trainghiem_content"]': 'SoTuDuyTraiNghiem_Content',
					'[id^="report_trucgiac_content"]': 'SoTuDuyTrucGiac_Content',
					'[id^="report_truongthanh_content"]': 'SoTruongThanh_Content',
					'[id^="report_tuongtac_content"]': 'SoNhanCach_Content',
				};
				$.each(selectors, function(selector, key) {
					const content = '<p>' + data[key].split('\n').join('</p><p>') + '</p>';
					$(selector).html(content);
				});
				//NUMBERS OF REPORTS AND LIST
				$('#c_namedobr').text(data['FULL_NAME'] + ', ' + data['DOB']);
				$("[id^='c_dob_']").text(data['DOB']);
				$("[id^='c_name_']").text(data['FULL_NAME']);
				$("[id^='c_phone_']").text(data['MOBILE_PHONE']);
				$("[id^='s_sobamsinh_']").text(data['SoTinhCachBamSinh']);
				$("[id^='s_sobaomat_']").text(data['SoDiemBaoMat']);
				$("[id^='s_sobosung_']").text(data['SoBoSung']);
				$("[id^='s_socamxuc_']").text(data['SoTuDuyCamXuc']);
				$("[id^='s_socanbang_']").text(data['SoCanBangTen']);
				$("[id^='s_sochang1_']").text(data['SoChangDuongDoi_num_1']);
				$("[id^='s_sochang2_']").text(data['SoChangDuongDoi_num_2']);
				$("[id^='s_sochang3_']").text(data['SoChangDuongDoi_num_3']);
				$("[id^='s_sochang4_']").text(data['SoChangDuongDoi_num_4']);
				$("[id^='s_sochangfull_']").text(`${data['SoChangDuongDoi_num_1']},${data['SoChangDuongDoi_num_2']},${data['SoChangDuongDoi_num_3']},${data['SoChangDuongDoi_num_4']}`);
				$("[id^='s_sochuky_']").text(data['SoChuKyVongDoi']);
				$("[id^='s_ddsm_']").text(data['SoKetNoi1']);
				$("[id^='s_soduongdoi_']").text(data['SoDuongDoi']);
				$("[id^='s_solap_']").text(data['SoLap']);
				$("[id^='s_sologic_']").text(data['SoTuDuyLogic']);
				$("[id^='s_namcanhan1_']").text(data['SoNamSinh1']);
				$("[id^='s_namcanhan2_']").text(data['SoNamSinh2']);
				$("[id^='s_namcanhan3_']").text(data['SoNamSinh3']);
				$("[id^='s_namcanhan4_']").text(data['SoNamSinh4']);
				$("[id^='s_namcanhan5_']").text(data['SoNamSinh5']);
				$("[id^='s_namcanhan_']").text(data['SoNamSinh']);
				$("[id^='s_ngaycanhan_']").text(data['SoNgayCaNhan']);
				$("[id^='s_ngaycanhan1_']").text(data['SoNgayCaNhan_1']);
				$("[id^='s_ngaycanhan2_']").text(data['SoNgayCaNhan_2']);
				$("[id^='s_ngaycanhan3_']").text(data['SoNgayCaNhan_3']);
				$("[id^='s_ngaycanhan4_']").text(data['SoNgayCaNhan_4']);
				$("[id^='s_ngaycanhan5_']").text(data['SoNgayCaNhan_5']);
				$("[id^='s_ngaycanhan6_']").text(data['SoNgayCaNhan_6']);
				$("[id^='s_ngaycanhan7_']").text(data['SoNgayCaNhan_7']);
				$("[id^='s_songaysinh_']").text(data['SoNgaySinh']);
				$("[id^='s_sonoicam_']").text(data['SoNoiCam']);
				$("[id^='s_sonoitam_']").text(data['SoLinhHon']);
				$("[id^='s_sononghiep_']").text(data['SoNoNghiep']);
				$("[id^='s_nttt_']").text(data['SoKetNoi2']);
				$("[id^='s_sosumenh_']").text(data['SoSuMenh']);
				$("[id^='s_sotenrieng_']").text(data['SoTenRieng']);
				$("[id^='s_sothachthuc1_']").text(data['SoThachThuc_1']);
				$("[id^='s_sothachthuc2_']").text(data['SoThachThuc_2']);
				$("[id^='s_sothachthuc3_']").text(data['SoThachThuc_3']);
				$("[id^='s_sothachthuc4_']").text(data['SoThachThuc_4']);
				$("[id^='s_sothachthucfull_']").text(`${data['SoThachThuc_1']},${data['SoThachThuc_2']},${data['SoThachThuc_3']},${data['SoThachThuc_4']}`);
				$("[id^='s_sothaido_']").text(data['SoThaiDo']);
				$("[id^='s_thangcanhan_']").text(data['SoThangCaNhan']);
				$("[id^='s_thangcanhan1_']").text(data['t1']);
				$("[id^='s_thangcanhan1_']").text(data['SoThangCaNhan1']);
				$("[id^='s_thangcanhan10_']").text(data['t10']);
				$("[id^='s_thangcanhan11_']").text(data['t11']);
				$("[id^='s_thangcanhan12_']").text(data['t12']);
				$("[id^='s_thangcanhan2_']").text(data['t2']);
				$("[id^='s_thangcanhan2_']").text(data['SoThangCaNhan2']);
				$("[id^='s_thangcanhan3_']").text(data['t3']);
				$("[id^='s_thangcanhan3_']").text(data['SoThangCaNhan3']);
				$("[id^='s_thangcanhan4_']").text(data['t4']);
				$("[id^='s_thangcanhan4_']").text(data['SoThangCaNhan4']);
				$("[id^='s_thangcanhan5_']").text(data['t5']);
				$("[id^='s_thangcanhan5_']").text(data['SoThangCaNhan5']);
				$("[id^='s_thangcanhan6_']").text(data['t6']);
				$("[id^='s_thangcanhan7_']").text(data['t7']);
				$("[id^='s_thangcanhan8_']").text(data['t8']);
				$("[id^='s_thangcanhan9_']").text(data['t9']);
				$("[id^='s_sothehe_']").text(data['SoTheHe']);
				$("[id^='s_sothieu_']").text(data['SoThieu']);
				$("[id^='s_sotiemthuc_']").text(data['SoPhanHoiTiemThuc']);
				$("[id^='s_sotrainghiem_']").text(data['SoTuDuyTraiNghiem']);
				$("[id^='s_sotrucgiac_']").text(data['SoTuDuyTrucGiac']);
				$("[id^='s_sotruongthanh_']").text(data['SoTruongThanh']);
				$("[id^='s_tuoichang1_']").text(data['SoChangDuongDoi_age_1']);
				$("[id^='s_tuoichang2_']").text(data['SoChangDuongDoi_age_2']);
				$("[id^='s_tuoichang3_']").text(data['SoChangDuongDoi_age_3']);
				$("[id^='s_tuoichang4_']").text(data['SoChangDuongDoi_age_4']);
				$("[id^='s_sotuongtac_']").text(data['SoNhanCach']);
				
				
				//Extract private name (vietnamese last 2 words)
				const fullName = data['FULL_NAME'];
				const nameArray = fullName.trim().split(' ');
				const privateName = nameArray.length >= 2 ? `${nameArray.slice(-2)[0]} ${nameArray.slice(-2)[1]}` : fullName;
				$("[id^='c_prname_']").text(privateName);


				
				//Execute data bind for outer functions	
				resetMatrix();
				ConvertToHeading(data);
				FormatBoltText(data);
				setMatrix(data);
				setArrow(data);
				setIsolated(data);
			}
	}
	


	
	// reset all matrix anf arrow to null
	function resetMatrix() {
		const birthdayElements = document.querySelectorAll('[id^="s_ns"]');
		const nameElements = document.querySelectorAll('[id^="s_ht"]');
		const mixElements = document.querySelectorAll('[id^="s_bdth"]');
		const arrowElements = document.querySelectorAll('.arrow-show');
		const isolatedElements = document.querySelectorAll('.isolated-show');

		// Clear current content
		birthdayElements.forEach(element => {
			element.textContent = '';
		});
		nameElements.forEach(element => {
			element.textContent = '';
		});
		mixElements.forEach(element => {
			element.textContent = '';
		});

		// Remove arrow and isolated classes
		arrowElements.forEach(element => {
			element.classList.remove('arrow-show');
			element.classList.add('hidden');
		});
		isolatedElements.forEach(element => {
			element.classList.remove('isolated-show');
			element.classList.add('hidden');
		});
	}


	// set matrix numbers
	function setMatrix(data) {
		const birthdayElements = $('[id^="s_ns"]');
		const nameElements = $('[id^="s_ht"]');
		const mixElements = $('[id^="s_bdth"]');
		for(let i = 1; i <= 9; i++) {
			const birthdayKey = `ns${i}`;
			const birthdayContent = data['SoBieuDoNgaySinh_Content'];
			const birthdayValue = birthdayContent.includes(birthdayKey) ? birthdayContent.split('#').find(t => t.includes(birthdayKey)).split('-')[1] : '';
			const nameKey = `ht${i}`;
			const nameContent = data['SoBieuDoHoTen_Content'];
			const nameValue = nameContent.includes(nameKey) ? nameContent.split('#').find(t => t.includes(nameKey)).split('-')[1] : '';
			const mixValue = birthdayValue + nameValue;
			$(birthdayElements[i - 1]).text(birthdayValue);
			$(nameElements[i - 1]).text(nameValue);
			$(mixElements[i - 1]).text(mixValue);
		}
	}

	// rules for arrows, empty arrows and isolated numbers
	const arrowRules = [  
		{ ids: ['ht1', 'ht4', 'ht7'], selector: '#ht1-7' },
		{ ids: ['ht2', 'ht5', 'ht8'], selector: '#ht2-8' },
		{ ids: ['ht3', 'ht6', 'ht9'], selector: '#ht3-9' },
		{ ids: ['ns1', 'ns2', 'ns3'], selector: '#ns1-3' },
		{ ids: ['ns1', 'ns4', 'ns7'], selector: '#ns1-7' },
		{ ids: ['ns1', 'ns5', 'ns9'], selector: '#ns1-9' },
		{ ids: ['ns2', 'ns5', 'ns8'], selector: '#ns2-8' },
		{ ids: ['ns3', 'ns6', 'ns9'], selector: '#ns3-9' },
		{ ids: ['ns4', 'ns5', 'ns6'], selector: '#ns4-6' },
		{ ids: ['ns3', 'ns5', 'ns7'], selector: '#ns7-3' },
		{ ids: ['ns7', 'ns8', 'ns9'], selector: '#ns7-9' },
	];
	const nsIsolated = [
		{ ids: ['ns1'], noneIds: ['ns2', 'ns4', 'ns5'], selector: '#ns-isol-1' },
		{ ids: ['ns3'], noneIds: ['ns2', 'ns5', 'ns6'], selector: '#ns-isol-3' },
		{ ids: ['ns7'], noneIds: ['ns4', 'ns5', 'ns8'], selector: '#ns-isol-7' },
		{ ids: ['ns9'], noneIds: ['ns5', 'ns6', 'ns8'], selector: '#ns-isol-9' },
	];

	
	// show arrows that match the rules
	function setArrow(data) {
		arrowRules.forEach(rule => {
			const arrowMatched = rule.ids.every(id => data['SoBieuDoHoTen_Content'].includes(id)) ||
				rule.ids.every(id => data['SoBieuDoNgaySinh_Content'].includes(id));
			if (arrowMatched) {
				$(rule.selector).removeClass('hide');
			} else if (rule.ids.every(id => !data['SoBieuDoNgaySinh_Content'].includes(id))) {
				$(rule.selector + 'e').removeClass('hidden');
			}
		});
	}

	// highlight the isolated number
	function setIsolated(data) {
		nsIsolated.forEach(rule => {
			if (rule.ids.every(id => data['SoBieuDoNgaySinh_Content'].includes(id)) &&
				rule.noneIds.every(id => !data['SoBieuDoNgaySinh_Content'].includes(id))) {
				$(rule.selector).removeClass('hidden');
			}
		});
	}


// Set Date / Month / Year base on today
function setDateTimeContent() {

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
	const monthNames = ["Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"];
	const dateElements = document.querySelectorAll('[id^="date"]');
	const yearElements = document.querySelectorAll('[id^="year"]');
	const monthElements = document.querySelectorAll('[id^="month_"]');

	for (let i = 0; i < 24; i++) {
		let content = '';
		let id = '';

		if (i < 7) {
			const dayOfWeek = dayNames[currentDate.getDay()];
			const date = currentDate.toLocaleDateString("vi-VN");
			content = `${dayOfWeek}, ${date} năng lượng số `;
			id = `date${i+1}`;
			currentDate.setDate(currentDate.getDate() + 1);
		} else if (i < 12) {
			const year = currentYear + i - 7;
			content = `NĂM ${year} năng lượng số`;
			id = `year${i-6}`;
		} else {
			const monthNum = i - 12 + currentDate.getMonth();
			const year = currentYear + Math.floor(monthNum / 12);
			const date = new Date(year, monthNum % 12, 1);
			content = `${monthNames[monthNum % 12]} năm ${year} - năng lượng số`;
			id = `month_${i-11}`;
		}

		const element = document.getElementById(id);
		if (element) {
			element.textContent = content;
		}
	}
}
setDateTimeContent();

//Find any characters within the two set of ### and c
function FormatBoltText(data) {
	  $('.report-details-content').html(function(index, html) {
		return $(this).html().replace(/###(.*?)###/g, '<span class="bolttext">$1</span>');
	  });
	}

//Find paragraphs with more than 4 consecutive uppercase characters and turn them into heading
function ConvertToHeading(data) {
	$('[id$="_content"]').find('p').each(function() {
	  const UPPERCASETEXT = $(this).text();
	  if (/\p{Lu}{4,}/gu.test(UPPERCASETEXT)) {
		$(this).addClass('report-details-heading');
	  }
	});

}

// Add purchase option for teaser contents
const Teasers = document.querySelectorAll('.content-showhalf, .content-hide');
Teasers.forEach(element => {
const link = document.createElement('a');
link.href = '#PURCHASE';

const span = document.createElement('span');
span.innerHTML = 'Xin vui lòng mua <span class="purchase-text-highlight">BẢN ĐẦY ĐỦ</span> để xem trọn vẹn chỉ số này.';
span.classList.add('purchaseline'); // Add class to the span element

link.appendChild(span); // Add the modified content to the link
element.parentNode.insertBefore(link, element.nextSibling);
});





//COUNT NUMBER OF FREE INDEXES
$(document).ready(function() {
  const ChiSoFree = document.querySelectorAll('.content-show').length;
  const ChiSoFull = document.querySelectorAll('.report-report');
	let count = 0;

	ChiSoFull.forEach(report => {
	  const computedStyle = window.getComputedStyle(report);
	  if (computedStyle.display !== 'none') {
		count++;
	  }
	});
  
  $('#chisofree .ladi-headline').text(`Bạn vừa trải nghiệm báo cáo miễn phí ${ChiSoFree} chỉ số.`);
  $('#chisofull .ladi-headline').text(`Để có bức tranh tổng quan hơn về cuộc đời bạn trong hiện tại và tương lai, khó khăn thách thức bạn sẽ gặp phải, những khuyến nghị giúp bạn chuẩn bị tốt hơn cho hành trình sắp tới, vui lòng mua Bài Số Học đầy đủ ${count} Chỉ Số.`);
});

//Charting section
function prepareChartData() {
	
	//Set the number of year based on div width
	let ChartRangeYears;
	const chartContainerWidth = $(".chart-container").width();
	if(window.innerWidth < 768) {
		ChartRangeYears = Math.floor(chartContainerWidth / 42.5);
	} else {
		ChartRangeYears = Math.floor(chartContainerWidth / 30);
	}
	
	//Set the rest of calculating variables
	const currentYear = new Date().getFullYear();
	const { pynBaseDay, pynBaseMonth, pynBaseYear } = getFormData();
	const ChartPYN_base = calculatePYN(pynBaseYear);
	const ChartX = [];
	const ChartPYN = [];
	const ChartY = [];

	//Calculate the targeting year pyn
	function calculatePYN(year) {
		const pynString = `${year}${pynBaseMonth}${pynBaseDay}`;
		let pyn = 0;
		for(let digit of pynString) {
			pyn += parseInt(digit);
		}
		while(pyn > 9) {
			pyn = Math.floor(pyn / 10) + (pyn % 10);
		}
		return pyn;
	}
	
	//Assign Y offset and set Y values
	const pynYValues = [3, 1.894, 0.746, 0, 0.727, 2, 0, 1.9, 4];
	for(let i = 0; i <= ChartRangeYears; i++) {
		let year;
		if(ChartRangeYears > 15) {
			year = currentYear - 5 + i;
		} else {
			year = currentYear - 2 + i;
		}
		ChartX.push(year);
		ChartPYN.push(calculatePYN(year));
		const pynYValue = pynYValues[ChartPYN[i] - 1];
		const circleNumber = ChartPYN[i] < ChartPYN_base ? Math.floor((year - pynBaseYear) / 9) + 1 : Math.floor((year - pynBaseYear) / 9);
		const ChartYi = circleNumber + pynYValue;
		ChartY.push(ChartYi);
	}
	
	const chartConfig = {
	  type: "line",
	  data: {
		labels: ChartX.map((year, index) => `${year}\n(PYN ${ChartPYN[index]})`),
		datasets: [{
		  label: '',
		  data: ChartY,
		  borderWidth: 3,
		  tension: 0.4,
		  borderJoinStyle: "round",
		  borderColor: "#12CCC0",
		  pointBackgroundColor: "white",
		  pointBorderColor: "#0A6E67",
		  pointBorderWidth: 2,
		  pointRadius: 5,
		  pointHoverRadius: 5,
		  pointHitRadius: 10,
		}, ],
	  },
	  options: {
		scales: {
		  x: {
			display: true,
			maxRotation: 0,
			autoSkipPadding: 15,
			maxTicksLimit: 10,
			auto: true,
			maxWidth: 75
		  },
		  y: {
			display: false,
			suggestedMin: Math.min(...ChartY) - 0.25,
			suggestedMax: Math.max(...ChartY) + 0.5,
		  },
		},
		plugins: {
		  title: {
			display: true,
			text: "CHU KỲ NĂM CÁ NHÂN",
			font: {
			  size: 16,
			  weight: "bold",
			},
		  },
		  legend: {
			display: false,
		  },
		  tooltip: {
			enable: true,
			callbacks: {
			  label: function(context) {
				return ChartPYN[context.dataIndex];
			  },
			  title: function(context) {
				return ChartPYN[context.dataIndex];
			  },
			},
			backgroundColor: "rgba(0, 0, 0, 0.8)",
			titleFont: {
			  size: 16,
			  weight: "bold",
			},
			bodyFont: {
			  size: 14,
			  weight: "bold",
			},
		  },
		},
	  },
	};

	const chartIds = ['pynChart', 'pynChart__inline'];

	chartIds.forEach((chartId) => {
	  const chartElement = document.getElementById(chartId);
	  if (chartElement) {
		const ctx = chartElement;
		const canvasParent = ctx.parentElement;
		ctx.width = canvasParent.offsetWidth;
		ctx.height = canvasParent.offsetHeight;
		
		// Check if there's an existing chart and destroy it
		const existingChart = Chart.instances[ctx.id];
		if (existingChart) {
		  existingChart.destroy();
		}
		
		new Chart(ctx, chartConfig);
	  }
	});
}

function setZodiac() {
const signRanges = [
	{ sign: "\u2648 Bạch Dương", start: "03-21", end: "04-19" },
	{ sign: "\u2649 Kim Ngưu", start: "04-20", end: "05-20" },
	{ sign: "\u264a Song Tử", start: "05-21", end: "06-21" },
	{ sign: "\u264b Cự Giải", start: "06-22", end: "07-22" },
	{ sign: "\u264c Sư Tử", start: "07-23", end: "08-22" },
	{ sign: "\u264d Xử Nữ", start: "08-23", end: "09-22" },
	{ sign: "\u264e Thiên Bình", start: "09-23", end: "10-22" },
	{ sign: "\u264f Bọ Cạp", start: "10-23", end: "11-21" },
	{ sign: "\u2650 Nhân Mã", start: "11-22", end: "12-21" },
	{ sign: "\u2651 Ma Kết", start: "12-22", end: "01-19" },
	{ sign: "\u2652 Bảo Bình", start: "01-20", end: "02-18" },
	{ sign: "\u2653 Song Ngư", start: "02-19", end: "03-20" },
];

const assignZodiacSign = (pynBaseDay, pynBaseMonth) => {
	const month = parseInt(pynBaseMonth);
	const day = parseInt(pynBaseDay);
	const dateStr = `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

	for (const range of signRanges) {
	if (dateStr >= range.start && dateStr <= range.end) {
		const elements = document.querySelectorAll(`[id^="s_sochiemtinh_"]`);
		for (const element of elements) {
			element.textContent = range.sign;
		}
		break;
	}
	}
};

const { pynBaseDay, pynBaseMonth  } = getFormData();
assignZodiacSign(pynBaseDay, pynBaseMonth);
}

//Prevent right click
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
