// ملف الألعاب التفاعلية الخاصة
class SpecialGames {
    constructor() {
        this.currentGame = null;
        this.init();
    }

    init() {
        // نضيف مستمع للأحداث للعب التفاعلي
        document.addEventListener('DOMContentLoaded', () => {
            this.setupGameListeners();
        });
    }

    setupGameListeners() {
        // نستمع لنقرات الأزرار في الألعاب
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('play-game-btn')) {
                const gameType = e.target.dataset.gameType;
                this.startGame(gameType);
            }
            
            if (e.target.classList.contains('submit-code-btn')) {
                this.checkCode();
            }
        });
    }

    // لعبة المنصات (ماريو)
    createPlatformerGame() {
        const gameContainer = document.createElement('div');
        gameContainer.className = 'platformer-game';
        gameContainer.innerHTML = `
            <div class="game-header">
                <h3>🎮 لعبة المنصات - جمع العملات</h3>
                <div class="game-stats">
                    <span>العملات: <span id="coins">0</span>/10</span>
                    <span>الوقت: <span id="time">60</span> ثانية</span>
                </div>
            </div>
            <div class="game-canvas-container">
                <canvas id="platformerCanvas" width="800" height="400"></canvas>
            </div>
            <div class="game-controls">
                <p>استخدم 🡄 🡆 للتحريك و 🡅 للقفز</p>
                <button class="btn-primary" id="restartGame">إعادة التشغيل</button>
            </div>
        `;

        return gameContainer;
    }

    // مختبر كيميائي
    createChemistryLab() {
        const labContainer = document.createElement('div');
        labContainer.className = 'chemistry-lab';
        labContainer.innerHTML = `
            <div class="lab-header">
                <h3>🔬 مختبر بلاكرس الكيميائي</h3>
                <p>اسحب الكيماويات إلى أنبوب الاختبار للحصول على التركيبة الصحيحة</p>
            </div>
            
            <div class="lab-equipment">
                <div class="chemicals-container">
                    <h4>الكيماويات المتاحة:</h4>
                    <div class="chemicals-list" id="chemicalsList"></div>
                </div>
                
                <div class="test-tube-container">
                    <h4>أنبوب الاختبار:</h4>
                    <div class="test-tube" id="testTube">
                        <div class="liquid"></div>
                    </div>
                    <div class="selected-chemicals" id="selectedChemicals"></div>
                </div>
                
                <div class="reaction-result" id="reactionResult"></div>
            </div>
            
            <div class="lab-controls">
                <button class="btn-primary" id="mixChemicals">اخلط الكيماويات</button>
                <button class="btn-secondary" id="clearTestTube">تفريغ الأنبوب</button>
            </div>
            
            <div class="chemical-hint">
                <p>💡 تلميح: <span id="labHint"></span></p>
            </div>
        `;

        return labContainer;
    }

    // محاكاة تصميم الروبوت
    createRobotDesigner() {
        const designerContainer = document.createElement('div');
        designerContainer.className = 'robot-designer';
        designerContainer.innerHTML = `
            <div class="designer-header">
                <h3>🤖 مصمم الروبوتات</h3>
                <p>ابنِ روبوت FTC الخاص بك</p>
            </div>
            
            <div class="designer-workspace">
                <div class="components-palette">
                    <h4>مكونات الروبوت:</h4>
                    <div class="components-list" id="componentsList"></div>
                </div>
                
                <div class="robot-canvas">
                    <div class="robot-base" id="robotBase">
                        <div class="robot-chassis"></div>
                    </div>
                    <div class="attached-components" id="attachedComponents"></div>
                </div>
                
                <div class="robot-specs">
                    <h4>مواصفات الروبوت:</h4>
                    <div id="robotSpecs">
                        <p>الوزن: <span id="weight">0</span> كجم</p>
                        <p>الطاقة: <span id="power">0</span> واط</p>
                        <p>الكفاءة: <span id="efficiency">0%</span></p>
                    </div>
                </div>
            </div>
            
            <div class="designer-controls">
                <button class="btn-primary" id="testRobot">اختبر الروبوت</button>
                <button class="btn-secondary" id="resetDesign">إعادة التصميم</button>
            </div>
            
            <div class="test-arena" id="testArena" style="display: none;">
                <h4>حلبة الاختبار:</h4>
                <canvas id="arenaCanvas" width="600" height="300"></canvas>
                <div id="testResult"></div>
            </div>
        `;

        return designerContainer;
    }

    // بدء لعبة حسب النوع
    startGame(gameType) {
        const container = document.getElementById('specialGameContainer');
        if (!container) return;

        container.innerHTML = '';
        
        switch(gameType) {
            case 'platformer':
                container.appendChild(this.createPlatformerGame());
                this.initPlatformerGame();
                break;
            case 'chemistry':
                container.appendChild(this.createChemistryLab());
                this.initChemistryLab();
                break;
            case 'robot_design':
                container.appendChild(this.createRobotDesigner());
                this.initRobotDesigner();
                break;
        }
    }

    // تهيئة لعبة المنصات
    initPlatformerGame() {
        const canvas = document.getElementById('platformerCanvas');
        const ctx = canvas.getContext('2d');
        const coinsEl = document.getElementById('coins');
        const timeEl = document.getElementById('time');
        const restartBtn = document.getElementById('restartGame');

        let player = {
            x: 50,
            y: 300,
            width: 30,
            height: 40,
            velocityY: 0,
            velocityX: 0,
            jumping: false,
            color: '#2ecc71'
        };

        let coins = [];
        let platforms = [];
        let collectedCoins = 0;
        let timeLeft = 60;
        let gameRunning = true;

        // إنشاء المنصات
        platforms = [
            {x: 0, y: 350, width: 200, height: 20},
            {x: 250, y: 300, width: 150, height: 20},
            {x: 450, y: 250, width: 150, height: 20},
            {x: 650, y: 200, width: 150, height: 20},
            {x: 0, y: 150, width: 100, height: 20}
        ];

        // إنشاء العملات
        for (let i = 0; i < 10; i++) {
            coins.push({
                x: Math.random() * 750,
                y: Math.random() * 300,
                collected: false,
                radius: 10
            });
        }

        // التحكم باللوحة
        const keys = {};
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // دورة اللعبة
        function gameLoop() {
            if (!gameRunning) return;

            // تحديث الوقت
            timeLeft -= 1/60;
            timeEl.textContent = Math.max(0, Math.floor(timeLeft));

            if (timeLeft <= 0) {
                gameRunning = false;
                alert('انتهى الوقت! حاول مرة أخرى.');
                return;
            }

            if (collectedCoins >= 10) {
                gameRunning = false;
                alert('🎉 نجحت! جمعت 10 عملات!');
                return;
            }

            // التحكم
            player.velocityX = 0;
            if (keys['ArrowRight']) player.velocityX = 5;
            if (keys['ArrowLeft']) player.velocityX = -5;
            if (keys['ArrowUp'] && !player.jumping) {
                player.velocityY = -12;
                player.jumping = true;
            }

            // الجاذبية
            player.velocityY += 0.5;
            player.x += player.velocityX;
            player.y += player.velocityY;

            // حدود اللعبة
            if (player.x < 0) player.x = 0;
            if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
            if (player.y > canvas.height - player.height) {
                player.y = canvas.height - player.height;
                player.velocityY = 0;
                player.jumping = false;
            }

            // تصادم مع المنصات
            platforms.forEach(platform => {
                if (player.x < platform.x + platform.width &&
                    player.x + player.width > platform.x &&
                    player.y < platform.y + platform.height &&
                    player.y + player.height > platform.y &&
                    player.velocityY > 0) {
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    player.jumping = false;
                }
            });

            // جمع العملات
            coins.forEach(coin => {
                if (!coin.collected) {
                    const dx = player.x + player.width/2 - coin.x;
                    const dy = player.y + player.height/2 - coin.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if (distance < player.width/2 + coin.radius) {
                        coin.collected = true;
                        collectedCoins++;
                        coinsEl.textContent = collectedCoins;
                    }
                }
            });

            // الرسم
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // رسم المنصات
            platforms.forEach(platform => {
                ctx.fillStyle = '#8e44ad';
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            });

            // رسم العملات
            coins.forEach(coin => {
                if (!coin.collected) {
                    ctx.fillStyle = '#f39c12';
                    ctx.beginPath();
                    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // رسم اللاعب
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            
            // رسم الوجه
            ctx.fillStyle = 'white';
            ctx.fillRect(player.x + 20, player.y + 10, 5, 5);

            requestAnimationFrame(gameLoop);
        }

        // إعادة التشغيل
        restartBtn.addEventListener('click', () => {
            collectedCoins = 0;
            timeLeft = 60;
            gameRunning = true;
            player.x = 50;
            player.y = 300;
            coins.forEach(coin => coin.collected = false);
            coinsEl.textContent = '0';
            timeEl.textContent = '60';
            gameLoop();
        });

        gameLoop();
    }

    // تهيئة المختبر الكيميائي
    initChemistryLab() {
        const chemicals = ['H₂O', 'CO₂', 'C₈H₁₈', 'O₂', 'N₂', 'CH₄', 'NaOH', 'HCl', 'NaCl', 'CH₃COOH'];
        const chemicalsList = document.getElementById('chemicalsList');
        const testTube = document.getElementById('testTube');
        const selectedChemicals = document.getElementById('selectedChemicals');
        const mixBtn = document.getElementById('mixChemicals');
        const clearBtn = document.getElementById('clearTestTube');
        const resultDiv = document.getElementById('reactionResult');
        const hintEl = document.getElementById('labHint');

        let selected = [];

        // عرض الكيماويات
        chemicals.forEach(chem => {
            const chemDiv = document.createElement('div');
            chemDiv.className = 'chemical-item';
            chemDiv.textContent = chem;
            chemDiv.draggable = true;
            
            chemDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('chemical', chem);
            });
            
            chemicalsList.appendChild(chemDiv);
        });

        // جعل الأنبوب يقبل السحب
        testTube.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        testTube.addEventListener('drop', (e) => {
            e.preventDefault();
            const chemical = e.dataTransfer.getData('chemical');
            if (chemical && selected.length < 3) {
                selected.push(chemical);
                updateSelectedChemicals();
            }
        });

        function updateSelectedChemicals() {
            selectedChemicals.innerHTML = '';
            selected.forEach(chem => {
                const span = document.createElement('span');
                span.className = 'selected-chemical';
                span.textContent = chem;
                selectedChemicals.appendChild(span);
            });

            // تغيير لون السائل في الأنبوب
            const liquid = testTube.querySelector('.liquid');
            if (selected.length > 0) {
                const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];
                liquid.style.backgroundColor = colors[(selected.length - 1) % colors.length];
                liquid.style.height = `${selected.length * 20}%`;
            } else {
                liquid.style.backgroundColor = 'transparent';
                liquid.style.height = '0%';
            }
        }

        // خلط الكيماويات
        mixBtn.addEventListener('click', () => {
            if (selected.length === 0) {
                resultDiv.innerHTML = '<p class="error">❌ الرجاء إضافة كيماويات أولاً</p>';
                return;
            }

            // تفاعلات كيميائية مبسطة
            const reactions = {
                'C₈H₁₈,O₂': { result: '🔥 انفجار كبير! وقود مثالي للروبوت', success: true },
                'H₂O,CH₃COOH': { result: '🧼 محلول تنظيف فعال للروبوت', success: true },
                'NaOH,HCl': { result: '⚠️ خطر! تفاعل قوي جداً', success: false },
                'H₂O,NaCl': { result: '💧 محلول ملحي عادي', success: false }
            };

            const combination = selected.sort().join(',');
            const reaction = reactions[combination];
            
            if (reaction) {
                if (reaction.success) {
                    resultDiv.innerHTML = `<p class="success">✅ ${reaction.result}</p>`;
                    // هنا يمكنك إضافة نقاط للاعب
                } else {
                    resultDiv.innerHTML = `<p class="error">❌ ${reaction.result}</p>`;
                }
            } else {
                resultDiv.innerHTML = '<p>🔄 لا يوجد تفاعل مثير</p>';
            }
        });

        // تفريغ الأنبوب
        clearBtn.addEventListener('click', () => {
            selected = [];
            updateSelectedChemicals();
            resultDiv.innerHTML = '';
        });

        // إظهار التلميحات حسب التحدي
        hintEl.textContent = 'اسحب كائنين فقط للأنبوب';
    }

    // تهيئة مصمم الروبوت
    initRobotDesigner() {
        const components = [
            { id: 'motor', name: '🔄 المحرك', weight: 2, power: 50 },
            { id: 'controller', name: '🎛️ المتحكم', weight: 1, power: 10 },
            { id: 'sensor', name: '📡 المستشعر', weight: 0.5, power: 5 },
            { id: 'wheels', name: '⚙️ العجلات', weight: 3, power: 0 },
            { id: 'arm', name: '🦾 الذراع', weight: 4, power: 70 },
            { id: 'battery', name: '🔋 البطارية', weight: 5, power: 100 }
        ];

        const componentsList = document.getElementById('componentsList');
        const robotBase = document.getElementById('robotBase');
        const attachedComponents = document.getElementById('attachedComponents');
        const testBtn = document.getElementById('testRobot');
        const resetBtn = document.getElementById('resetDesign');
        const testArena = document.getElementById('testArena');
        const weightEl = document.getElementById('weight');
        const powerEl = document.getElementById('power');
        const efficiencyEl = document.getElementById('efficiency');

        let attached = [];
        let robotStats = { weight: 0, power: 0 };

        // عرض المكونات
        components.forEach(comp => {
            const compDiv = document.createElement('div');
            compDiv.className = 'component-item';
            compDiv.textContent = comp.name;
            compDiv.dataset.id = comp.id;
            compDiv.draggable = true;
            
            compDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('component', JSON.stringify(comp));
            });
            
            componentsList.appendChild(compDiv);
        });

        // جعل قاعدة الروبوت تقبل السحب
        robotBase.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        robotBase.addEventListener('drop', (e) => {
            e.preventDefault();
            const compData = e.dataTransfer.getData('component');
            if (compData) {
                const component = JSON.parse(compData);
                attachComponent(component);
            }
        });

        function attachComponent(component) {
            // تأكد من عدم تكرار المكون
            if (!attached.find(c => c.id === component.id)) {
                attached.push(component);
                updateRobot();
            }
        }

        function updateRobot() {
            // تحديث المكونات المرفقة
            attachedComponents.innerHTML = '';
            attached.forEach(comp => {
                const compEl = document.createElement('div');
                compEl.className = `attached-component ${comp.id}`;
                compEl.textContent = comp.name;
                attachedComponents.appendChild(compEl);
            });

            // حساب الإحصائيات
            robotStats.weight = attached.reduce((sum, c) => sum + c.weight, 0);
            robotStats.power = attached.reduce((sum, c) => sum + c.power, 0);
            
            const efficiency = attached.length >= 4 ? 
                Math.min(100, (robotStats.power / robotStats.weight) * 10) : 0;

            weightEl.textContent = robotStats.weight.toFixed(1);
            powerEl.textContent = robotStats.power;
            efficiencyEl.textContent = `${efficiency.toFixed(0)}%`;
        }

        // اختبار الروبوت
        testBtn.addEventListener('click', () => {
            if (attached.length < 3) {
                alert('❌ الروبوت يحتاج إلى 3 مكونات على الأقل');
                return;
            }

            testArena.style.display = 'block';
            simulateRobotTest();
        });

        function simulateRobotTest() {
            const canvas = document.getElementById('arenaCanvas');
            const ctx = canvas.getContext('2d');
            const testResult = document.getElementById('testResult');

            let robotX = 50;
            let score = 0;

            // تنظيف المسار
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // رسم مسار التحدي
            ctx.fillStyle = '#34495e';
            ctx.fillRect(0, 200, canvas.width, 100);
            
            // رسم عوائق
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(300, 150, 30, 50);
            ctx.fillRect(450, 150, 30, 50);
            
            // رسم خط النهاية
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(canvas.width - 50, 180, 10, 40);

            // حركة الروبوت
            const speed = (robotStats.power / robotStats.weight) * 2;
            const interval = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // إعادة رسم المسار
                ctx.fillStyle = '#34495e';
                ctx.fillRect(0, 200, canvas.width, 100);
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(300, 150, 30, 50);
                ctx.fillRect(450, 150, 30, 50);
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(canvas.width - 50, 180, 10, 40);

                // تحريك الروبوت
                robotX += speed;
                
                // رسم الروبوت
                ctx.fillStyle = '#3498db';
                ctx.fillRect(robotX, 180, 40, 40);
                
                // التحقق من الوصول للنهاية
                if (robotX >= canvas.width - 60) {
                    clearInterval(interval);
                    score = Math.floor(efficiencyEl.textContent);
                    testResult.innerHTML = `<p class="success">✅ نجاح! الروبوت أكمل المسار بنتيجة ${score}</p>`;
                }
                
                // التحقق من التصادم
                if ((robotX > 290 && robotX < 330) || (robotX > 440 && robotX < 480)) {
                    clearInterval(interval);
                    testResult.innerHTML = '<p class="error">❌ فشل! الروبوت اصطدم بالعائق</p>';
                }
            }, 50);
        }

        // إعادة التصميم
        resetBtn.addEventListener('click', () => {
            attached = [];
            updateRobot();
            testArena.style.display = 'none';
        });
    }

    // فحص الكود المبرمج
    checkCode() {
        const codeInput = document.querySelector('.code-input');
        if (!codeInput) return;

        const userCode = codeInput.value.trim();
        const correctCode = "robot.moveForward();";
        
        if (userCode === correctCode) {
            alert('✅ الكود صحيح! يمكنك الآن لعب لعبة المنصات');
            // إظهار زر اللعبة
            const playBtn = document.createElement('button');
            playBtn.className = 'btn-primary play-game-btn';
            playBtn.dataset.gameType = 'platformer';
            playBtn.textContent = '🎮 ابدأ اللعب الآن';
            codeInput.parentNode.appendChild(playBtn);
        } else {
            alert('❌ الكود غير صحيح، حاول مرة أخرى');
        }
    }
}

// إنشاء كائن الألعاب
const specialGames = new SpecialGames();

// دالة لإظهار التحديات التفاعلية
function renderInteractiveChallenge(challenge, index, container) {
    const challengeDiv = document.createElement('div');
    challengeDiv.className = 'interactive-challenge';
    
    switch(challenge.type) {
        case 'code':
            challengeDiv.innerHTML = `
                <h3>${challenge.question}</h3>
                <pre>${challenge.code}</pre>
                <textarea class="code-input" placeholder="اكتب الكود المصحح هنا..."></textarea>
                ${challenge.hint ? `<p class="hint">💡 ${challenge.hint}</p>` : ''}
                <button class="submit-code-btn btn-primary">فحص الكود</button>
                <div id="specialGameContainer"></div>
            `;
            break;
            
        case 'game':
            challengeDiv.innerHTML = `
                <h3>${challenge.question}</h3>
                <div id="specialGameContainer"></div>
                <button class="play-game-btn btn-primary" data-game-type="${challenge.gameType}">
                    ابدأ اللعب
                </button>
            `;
            break;
            
        case 'lab':
            challengeDiv.innerHTML = `
                <h3>${challenge.question}</h3>
                <div id="specialGameContainer"></div>
                <button class="play-game-btn btn-primary" data-game-type="chemistry">
                    افتح المختبر
                </button>
            `;
            // تخزين البيانات المطلوبة
            challengeDiv.dataset.chemicals = JSON.stringify(challenge.chemicals);
            challengeDiv.dataset.correctCombination = JSON.stringify(challenge.correctCombination);
            challengeDiv.dataset.hint = challenge.hint;
            break;
            
        case 'design':
            challengeDiv.innerHTML = `
                <h3>${challenge.question}</h3>
                <div id="specialGameContainer"></div>
                <button class="play-game-btn btn-primary" data-game-type="robot_design">
                    افتح المصمم
                </button>
            `;
            break;
    }
    
    container.appendChild(challengeDiv);
}

// تصدير الوظائف
export { specialGames, renderInteractiveChallenge };