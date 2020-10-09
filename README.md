# Typing Game

- ## API 모듈

  window.XMLHttpRequest를 사용하여 서버와 통신하고 성공/실패 결과를 Promise 객체로 전달할 수 있도록 구성하였습니다.

  이 과제에선 필요하지 않았지만, GET, POST method 옵션 설정 및 JSON - urlEncoded parameter 전달 기능까지 구현했습니다.
<br/><br/>

- ## Router 모듈

  Vue 프레임워크를 쓰면서 주로 사용하던 Hash routing을 구현했습니다.
  ```typescript
  {
    path: string,
    constructor: ComponentConstructor,
  }
  ```
  위의 구조로 구성된 `routeList` 배열을 내부에 가지고있으며, route push 혹은 back 호출을 받을 경우
  
  `window.location.hash` 값을 검사한 뒤 맞는 route 타겟을 찾으면
  
  `renderComponent` 메소드를 통해 해당 Component를 생성하고 rootApp에 렌더링하고 `rootApp`과 새로 생성되는 component 간 `$parent - $child` 관계를 생성해줍니다.

  Component의 constructor는 생성 시 object 형식의 routeParameter를 매개변수로 받을 수 있어, 각 view 진입 시 원하는 parameter 값을 넘길 수 있습니다.
<br/><br/>

- ## Compoent / View
  - ### base
    main.ts의 rootApp을 포함하여 view를 구성하는 각 component 클래스의 기본이 되는 클래스입니다.

    `setTemplateData` 메소드를 통해 component가 가진 데이터를 html template 안쪽 지정된 element에 innterText로 넣을 수 있습니다.

    `checkVShow` 메소드를 통해 조건에 따라 html element를 보여줄지, 안보여줄지 설정합니다.

    `component` 내부에서 변경이 일어나 렌더링 업데이트가 필요한 경우 이 두 메소드를 호출해주는 updateComponent 메소드를 호출하여 사용합니다.
    <br><br>

  - ### RootApp (main.ts)

    base Component를 extends 받아 생성한 최상위 component 입니다.

    `index.html`에 미리 만들어 둔 `#root-app` element를 찾아 constructor 매개변수로 넣어 component 생성 후 렌더링 타겟으로 지정합니다.

    `rootApp constructor` 내부에서 `router` 모듈을 생성하며, 해당 `router` 내부에서 최초 렌더링을 진행합니다.
    <br><br>

  - ### Quiz

    Typing Game을 진행하는 화면입니다.

    `rootApp.$router`를 통해 렌더링 완료 후, 호출되는 `mounted` 메소드를 통해
    `getWords` 메소드 실행과, input element에 대한 keyup EventListener를 등록합니다.

    keyup EventListener에 연결되는 `onInputKeyup` 메소드에선 input element의 입력 값을 검사하며
    정답 시 `단어별 최초 제한 시간 - 남은 시간`을 계산하여 `totalTime`에 더한 뒤,
    다음 단어로 넘어가는 `nextWord` 메소드를 실행시킵니다.

    `startQuiz` 메소드를 실행시켜서 게임을 시작합니다.  
    `setQuizWord` 메소드를 실행하며 첫번째 단어를 표시하고, 해당 단어의 제한시간만큼 `setInterval` 타이머를 실행시킵니다.

    `nextWord` 메소드에선 현재 단어를 가리키는 `currentWordIndex`를 1씩 올리고,  
    index 값이 words.length 와 같아졌을 땐, 지금까지 저장된 `totalTime`에서 `totalScore`를 나눠 평균 시간을 구한 뒤, route parameter에 포함하여 completeView로 이동합니다.
    <br><br>


  - ### Complete

    게임 결과 화면입니다.

    route parameter로 넘어온 `avgTime`, `totalScore`값을 받아 저장하고  
    템플릿 내 지정된 위치에 프린트합니다.

    다시 시작 버튼 클릭 시 `restartQuiz` 메소드를 실행하여 `$router.back()`으로 이전 화면으로 돌아갑니다.
    <br><br>

<br/><br/>