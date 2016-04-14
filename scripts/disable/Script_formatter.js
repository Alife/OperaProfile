opera.addEventListener( 'BeforeScript', function( e ){

	/* defining the various scopes we care about for this excercise */
	var CODE = 0;  /* normal JS code */
	var STRING_DBL = 1;  /* double quoted string */
	var STRING_SGL = 2;  /* single quoted string */
	var REGEXP = 3 ; /* regexp literal */
	var ESCAPE = 4 ; /* some escape char (backslash) */
	var MULTI_LINE_COMMENT = 5 ;
	var SINGLE_LINE_COMMENT = 6 ;

	var theStart, theCode;

	theStart = (new Date()).getTime();

	theCode = e.element.text;

	var $output=''; /* would array perform better as in JS? */
	var $num_indents = 0;
	var current_index = 0;
	var current_letter='';

	var theScope = CODE;
	var $before_escape_scope=0;
	var $at_start_of_statement_or_expression=true; /* used to distinguish divisor from regexp literal */
	var $last_complete_word = ''; /* some rudimentary tokenisation is required for the divisor-or-regexp problem */
	var $statement_words = ['return', 'typeof', 'instanceof'];

	while( current_index <   theCode.length   ){
		current_letter =  theCode.charAt( current_index );
		//echo ( (time() - theStart). "ms elapsed, now on current_index / ".strlen(theCode)." current_letter, mode: theScope \n");
		$pre = ''; /* add this string *before* this character when constructing output */
		$post = ''; /* add this string *after* this character when constructing output */
		switch( current_letter ){
			case '"': /* double quote */
				switch( theScope ){
					case STRING_DBL:
						theScope=CODE ; break; /* a non-escaped quote inside string terminates string */
					case ESCAPE:
						theScope = $before_escape_scope; break; /* the quote was escaped, return to previous scope */
					case CODE:
						theScope = STRING_DBL ; /* start-of-string double quote */
				}
				break;
			case '\'': /* single quote */
				switch( theScope ){
					case STRING_SGL:
						theScope=CODE ; break; /* a non-escaped quote inside string terminates string */
					case ESCAPE:
						theScope = $before_escape_scope; break; /* the quote was escaped, return to previous scope */
					case CODE:
						theScope = STRING_SGL ;  /* start-of-string single quote */
				}
				break;
			case '\\':
				if( theScope == STRING_DBL || theScope == STRING_SGL || theScope == REGEXP ){
					$before_escape_scope = theScope ;
					theScope = ESCAPE ; /* next character not to be taken seriously (well..) */
				}else if( theScope == ESCAPE ){ /* handle escaped backslashes "\\" */
					theScope = $before_escape_scope ;
				}
				break;
			case '/':
				if( theScope == CODE ){ /* lookahead: start of comment or something else? */
					$tmp =  theCode.charAt( current_index+1 );
					if( $tmp == '*' ){ /* start of multi-line comment */
						theScope = MULTI_LINE_COMMENT ;
					}else if( $tmp == '/' ){ /* start of single-line comment */
						theScope = SINGLE_LINE_COMMENT ;
					}else if( $at_start_of_statement_or_expression || in_array( $last_complete_word, $statement_words ) ){ /* start of regexp */
						theScope = REGEXP ;
					}
				}else if( theScope == ESCAPE ){
					theScope = $before_escape_scope ;
				}else if( theScope == REGEXP ){
					theScope = CODE ;
				}else if( theScope == MULTI_LINE_COMMENT ){ /* time to leave the comment?? */
					$tmp =  theCode.charAt( current_index-1 );
					if( $tmp == '*' ) theScope = CODE ; /* we only enter multi-line-comment mode from CODE scope AFAIK */
				}
				break;
			case '{':
				if(  theScope == CODE ){ /* start-of-block curly brace */
					$num_indents ++ ;
					$post = "\n";
					$post += str_repeat(  " ", $num_indents  );
					$at_start_of_statement_or_expression = true;
				}else if( theScope == ESCAPE ){
					theScope = $before_escape_scope ;
				}
				break;
			case '}':
				if(  theScope == CODE ){ /* end-of-block curly brace */
					if(  $num_indents>0  )$num_indents -- ;
					$pre = "\n";
					$pre += str_repeat(  " ", $num_indents  );
					$post = "\n" + str_repeat(  " ", $num_indents ) ;
				}else if( theScope == ESCAPE ){
					theScope = $before_escape_scope ;
				}
				break;
			case ';':
	//		case ',':
				if(  theScope == CODE ){ /* end-of-statement semicolon //, or between-variables comma */
					$post = "\n";
					$post += str_repeat(  " ", $num_indents  );
					$at_start_of_statement_or_expression = true;
				}else if( theScope == ESCAPE ){
					theScope = $before_escape_scope ;
				}
				break;
			case "\n":
				if( theScope == SINGLE_LINE_COMMENT ){
					theScope = CODE; /* we only enter SINGLE_LINE_COMMENT mode from CODE, right?  */
				}else if( theScope == ESCAPE ){
					theScope = $before_escape_scope ;
				} /* no break, we want to get to the $at_start_of_statement_or_expression bit below */
			case '(':
			case '!':
			case '=':
			case '-':
			case '+':
			case '*':
			case '&':
			case ':':
			case '[':
			case ',':
			case '|':
				if( theScope == CODE ){
					$at_start_of_statement_or_expression=true; /* at start of parens, after equal sign etc.. if the next char is a forward slash it will be a start-of-regexp, not a divisor */
				}else if( theScope == ESCAPE ){
					theScope = $before_escape_scope ;
				}
				break;
			default:
				if( theScope == ESCAPE ){
					theScope = $before_escape_scope ; /* always drop out of escape mode on next character..  yes, multi-char escapes exist but it's OK to treat the rest of it as part of the string or regexp */
				}
				if( theScope == CODE ){
					if( !( current_letter==' ' || current_letter=='\t' ) ) $at_start_of_statement_or_expression = false;
				}
				break;
		}

		if( current_letter.match(/[a-zA-Z0-9]/) ){
			$last_complete_word += current_letter;
		}else{
			$last_complete_word = '';
		}


	//	if( theScope == CODE &&  ( current_letter == " " || current_letter == "\n" ) ){ /* this script will add formatting whitespace */ // proven too fragile..
	//
	//	}else{
			$output += $pre + current_letter + $post ;
	//	}
		current_index++;
	}
	e.element.text = $output;

	function str_repeat( str, count ){
		var tmp = new Array(count);
		return tmp.join(str);
	}
	function in_array(needle, haystack){
		for(var i=0,el;el=haystack[i];i++){
			if( el==needle )return true;
		}
		return false;
	}
}, false);
