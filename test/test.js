var test = require('tape')
	, tpl = require('../')
	;

test('test render call', function (t) {
	var str = tpl.render('${name}', { name : 'steve' });
	t.equal(str, 'steve');
	t.end();
});

test('test compile call', function (t) {
	var c = tpl.compile('${name}');

	var d = c({ name : 'steve' });

	t.equal(d, 'steve');
	t.end();
});

test('test filters/modifiers', function (t) {
	tpl.filters.toYesNo = function (val) {
		return (val) ? 'yes' : 'no';
	}

	var str1 = tpl.render('${good|toYesNo}', { good : true });
	var str2 = tpl.render('${good|toYesNo}', { good : false });

	t.equal(str1, 'yes');
	t.equal(str2, 'no');
	t.end();
});

test('test include files', function (t) {
	var str1 = tpl.render('before {include test-include1.html} after', { name : 'steve' });

	t.equal(str1, 'before steve after');
	t.end();
});
