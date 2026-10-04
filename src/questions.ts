export interface Question {
  cau: number;
  hoi: string;
  A: string;
  B: string;
  C: string;
  D: string;
  dapAn: 'A' | 'B' | 'C' | 'D';
}

export const QUESTIONS: Question[] = [
  {"cau":1,"hoi":"Present Simple: I _______ in the park every morning.","A":"walk","B":"am walking","C":"walked","D":"was walking","dapAn":"A"},
  {"cau":2,"hoi":"Present Continuous: I _______ to school right now.","A":"walk","B":"am walking","C":"walked","D":"was walking","dapAn":"B"},
  {"cau":3,"hoi":"Past Simple: I _______ home late yesterday.","A":"walk","B":"am walking","C":"walked","D":"was walking","dapAn":"C"},
  {"cau":4,"hoi":"Past Continuous: I _______ when it started to rain.","A":"walk","B":"am walking","C":"walked","D":"was walking","dapAn":"D"},
  {"cau":5,"hoi":"Present Simple: I often _______ to my friends on the phone.","A":"talk","B":"am talking","C":"talked","D":"was talking","dapAn":"A"},
  {"cau":6,"hoi":"Present Continuous: I _______ to the teacher at the moment.","A":"talk","B":"am talking","C":"talked","D":"was talking","dapAn":"B"},
  {"cau":7,"hoi":"Past Simple: I _______ to him about the project last week.","A":"talk","B":"am talking","C":"talked","D":"was talking","dapAn":"C"},
  {"cau":8,"hoi":"Past Continuous: I _______ loudly when she entered the room.","A":"talk","B":"am talking","C":"talked","D":"was talking","dapAn":"D"},
  {"cau":9,"hoi":"Present Simple: I usually _______ television in the evening.","A":"watch","B":"am watching","C":"watched","D":"was watching","dapAn":"A"},
  {"cau":10,"hoi":"Present Continuous: Look! I _______ a great movie now.","A":"watch","B":"am watching","C":"watched","D":"was watching","dapAn":"B"},
  {"cau":11,"hoi":"Past Simple: I _______ a football match last night.","A":"watch","B":"am watching","C":"watched","D":"was watching","dapAn":"C"},
  {"cau":12,"hoi":"Past Continuous: I _______ TV at 8 PM yesterday.","A":"watch","B":"am watching","C":"watched","D":"was watching","dapAn":"D"},
  {"cau":13,"hoi":"Present Simple: I always _______ to music before bed.","A":"listen","B":"am listening","C":"listened","D":"was listening","dapAn":"A"},
  {"cau":14,"hoi":"Present Continuous: Please be quiet, I _______ to the news.","A":"listen","B":"am listening","C":"listened","D":"was listening","dapAn":"B"},
  {"cau":15,"hoi":"Past Simple: I _______ to that podcast two days ago.","A":"listen","B":"am listening","C":"listened","D":"was listening","dapAn":"C"},
  {"cau":16,"hoi":"Past Continuous: I _______ to the radio when you called.","A":"listen","B":"am listening","C":"listened","D":"was listening","dapAn":"D"},
  {"cau":17,"hoi":"Present Simple: I _______ a new English word every day.","A":"learn","B":"am learning","C":"learned","D":"was learning","dapAn":"A"},
  {"cau":18,"hoi":"Present Continuous: I _______ how to swim this summer.","A":"learn","B":"am learning","C":"learned","D":"was learning","dapAn":"B"},
  {"cau":19,"hoi":"Past Simple: I _______ a lot from that book last year.","A":"learn","B":"am learning","C":"learned","D":"was learning","dapAn":"C"},
  {"cau":20,"hoi":"Past Continuous: I _______ about history when the bell rang.","A":"learn","B":"am learning","C":"learned","D":"was learning","dapAn":"D"},
  {"cau":21,"hoi":"Present Simple: I _______ my bedroom on Sundays.","A":"clean","B":"am cleaning","C":"cleaned","D":"was cleaning","dapAn":"A"},
  {"cau":22,"hoi":"Present Continuous: I can't go out, I _______ the house now.","A":"clean","B":"am cleaning","C":"cleaned","D":"was cleaning","dapAn":"B"},
  {"cau":23,"hoi":"Past Simple: I _______ the whole kitchen yesterday morning.","A":"clean","B":"am cleaning","C":"cleaned","D":"was cleaning","dapAn":"C"},
  {"cau":24,"hoi":"Past Continuous: I _______ the floor when they arrived.","A":"clean","B":"am cleaning","C":"cleaned","D":"was cleaning","dapAn":"D"},
  {"cau":25,"hoi":"Present Simple: I sometimes _______ chess with my brother.","A":"play","B":"am playing","C":"played","D":"was playing","dapAn":"A"},
  {"cau":26,"hoi":"Present Continuous: I _______ a video game right now.","A":"play","B":"am playing","C":"played","D":"was playing","dapAn":"B"},
  {"cau":27,"hoi":"Past Simple: I _______ tennis last weekend.","A":"play","B":"am playing","C":"played","D":"was playing","dapAn":"C"},
  {"cau":28,"hoi":"Past Continuous: I _______ football at 5 PM yesterday.","A":"play","B":"am playing","C":"played","D":"was playing","dapAn":"D"},
  {"cau":29,"hoi":"Present Simple: I _______ in a big office.","A":"work","B":"am working","C":"worked","D":"was working","dapAn":"A"},
  {"cau":30,"hoi":"Present Continuous: I _______ very hard on my project today.","A":"work","B":"am working","C":"worked","D":"was working","dapAn":"B"},
  {"cau":31,"hoi":"Past Simple: I _______ late last Friday.","A":"work","B":"am working","C":"worked","D":"was working","dapAn":"C"},
  {"cau":32,"hoi":"Past Continuous: I _______ when the power went out.","A":"work","B":"am working","C":"worked","D":"was working","dapAn":"D"},
  {"cau":33,"hoi":"Present Simple: I occasionally _______ my grandparents.","A":"visit","B":"am visiting","C":"visited","D":"was visiting","dapAn":"A"},
  {"cau":34,"hoi":"Present Continuous: I _______ my aunt in London at present.","A":"visit","B":"am visiting","C":"visited","D":"was visiting","dapAn":"B"},
  {"cau":35,"hoi":"Past Simple: I _______ the museum two weeks ago.","A":"visit","B":"am visiting","C":"visited","D":"was visiting","dapAn":"C"},
  {"cau":36,"hoi":"Past Continuous: I _______ Paris this time last year.","A":"visit","B":"am visiting","C":"visited","D":"was visiting","dapAn":"D"},
  {"cau":37,"hoi":"Present Simple (Verb to be): I _______ a student at this school.","A":"am","B":"is","C":"was","D":"were","dapAn":"A"},
  {"cau":38,"hoi":"Past Simple (Verb to be): I _______ very tired yesterday evening.","A":"am","B":"was","C":"were","D":"have been","dapAn":"B"},
  {"cau":39,"hoi":"Present Continuous: I _______ money to buy a new bicycle now.","A":"save","B":"am saving","C":"saved","D":"was saving","dapAn":"B"},
  {"cau":40,"hoi":"Past Continuous: I _______ documents when the computer crashed.","A":"save","B":"am saving","C":"saved","D":"was saving","dapAn":"D"}
];

export const STUDENTS = ['Bảo Khuê', 'Duy Sang', 'Minh Chi'] as const;
export type StudentName = typeof STUDENTS[number];
