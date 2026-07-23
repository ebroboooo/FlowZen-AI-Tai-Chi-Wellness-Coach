/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Program } from '@/types';

export const programs: Program[] = [
  {
    id: 'tai-chi-foundations',
    title: 'Tai Chi Foundations',
    description: 'Establish deep somatic awareness, vertical alignment, and diaphragmatic breathing core principles.',
    focus: ['Breathing', 'Posture', 'Balance', 'Basic awareness'],
    element: 'earth',
    avatarStyle: 'grounded',
    environmentTheme: 'Ancient Cedar Grove',
    levels: {
      Beginner: [
        {
          id: 'foundations-beg-1',
          title: 'Finding Your Root',
          description: 'Learn the primary standing alignment of Zhan Zhuang and how to sink weight through the center of your feet.',
          duration: 10,
          difficulty: 'Beginner',
          benefits: ['Grounds the nervous system', 'Corrects slouching posture', 'Builds lower body base'],
          targetAreas: ['Feet', 'Ankles', 'Spine', 'Shoulders'],
          requiredExperience: 'No previous experience required.',
          movements: [
            {
              id: 'm-commencement',
              name: 'Tai Chi Commencement',
              traditionalName: '起势 (Qǐ Shì)',
              description: 'The starting posture where arms slowly rise to shoulder height and lower as you sink your hips, initiating the flow of Qi.',
              benefits: 'Circulates energy, releases the shoulder girdle, stabilizes blood pressure.',
              breathingPattern: 'Inhale as arms float up, exhale as hips sink and hands press down.',
              commonMistakes: [
                'Lifting the shoulders toward the ears.',
                'Bending forward at the waist while sinking.',
                'Locking the elbows at the top of the movement.'
              ],
              safetyNotes: 'Keep your knees aligned with your second toes; do not let them collapse inward.',
              frontAnimationPlaceholderId: 'anim-commencement-front',
              sideAnimationPlaceholderId: 'anim-commencement-side'
            },
            {
              id: 'm-zhan-zhuang',
              name: 'Standing Like a Tree',
              traditionalName: '站桩 (Zhàn Zhuāng)',
              description: 'A static meditative hold where the body aligns vertically, hips sink as if sitting, and arms frame a circle in front of the chest.',
              benefits: 'Develops deep structural core strength, calms the mind, builds leg endurance.',
              breathingPattern: 'Continuous, slow, and deep abdominal breathing (Dantian breathing).',
              commonMistakes: [
                'Tensing the upper back and chest.',
                'Arching the lower back (swayback).',
                'Holding the breath.'
              ],
              safetyNotes: 'Slightly tuck your pelvis to flatten your lumbar spine. Keep your knees gently soft.',
              frontAnimationPlaceholderId: 'anim-zhanzhuang-front',
              sideAnimationPlaceholderId: 'anim-zhanzhuang-side'
            }
          ]
        }
      ],
      Intermediate: [
        {
          id: 'foundations-int-1',
          title: 'Opening the Gates',
          description: 'Introduce fluid circular coordination of upper and lower limbs while maintaining vertical alignment.',
          duration: 15,
          difficulty: 'Intermediate',
          benefits: ['Improves joint lubrication', 'Enhances bilateral coordination', 'Calms cerebral activity'],
          targetAreas: ['Shoulder joints', 'Hips', 'Elbows', 'Wrists'],
          requiredExperience: 'Comfort with fundamental standing and breathing.',
          movements: [
            {
              id: 'm-cloud-hands',
              name: 'Wave Hands Like Clouds',
              traditionalName: '云手 (Yún Shǒu)',
              description: 'Hands rotate in opposing vertical circles in front of the torso, matching slow horizontal weight shifting.',
              benefits: 'Relieves chronic back pain, coordinates left-right brain, loosens shoulders.',
              breathingPattern: 'Inhale when shifting weight and hand sweeps right; exhale when shifting left.',
              commonMistakes: [
                'Leading with the arms rather than rotating from the waist.',
                'Bobbing up and down while shifting weight.',
                'Rigid wrists or fingers.'
              ],
              safetyNotes: 'Pivot from the Dan Tian (waist), keeping your hips tucked and stable.',
              frontAnimationPlaceholderId: 'anim-cloudhands-front',
              sideAnimationPlaceholderId: 'anim-cloudhands-side'
            },
            {
              id: 'm-single-whip',
              name: 'Single Whip',
              traditionalName: '单鞭 (Dān Biān)',
              description: 'Form a hook hand with the right hand while expanding the left arm outwards in a wide, defensive sweep.',
              benefits: 'Stretches the tendons of the chest, expands chest capacity, strengthens legs.',
              breathingPattern: 'Inhale as hands draw in; exhale as you expand outward into the posture.',
              commonMistakes: [
                'Over-extending and losing vertical center.',
                'Dropping the right elbow lower than the wrist.',
                'Failing to root the rear leg.'
              ],
              safetyNotes: 'Avoid hyper-extending the extended knee; keep it soft.',
              frontAnimationPlaceholderId: 'anim-singlewhip-front',
              sideAnimationPlaceholderId: 'anim-singlewhip-side'
            }
          ]
        }
      ],
      Advanced: [
        {
          id: 'foundations-adv-1',
          title: 'The Spiral Force',
          description: 'Master the spiraling energy movements of Silk Reeling, developing continuous structural alignment.',
          duration: 20,
          difficulty: 'Advanced',
          benefits: ['Unlocks spiral fascia lines', 'Increases deep rotational joint power', 'Enhances somatic focus'],
          targetAreas: ['Hip joints (Kua)', 'Shoulders', 'Spine', 'Fascial meridians'],
          requiredExperience: 'Excellent posture and structural awareness.',
          movements: [
            {
              id: 'm-silk-reeling',
              name: 'Silk Reeling Spiral',
              traditionalName: '缠丝功 (Chán Sī Gōng)',
              description: 'Continuous spiral movements originating from the feet, spiraling through the waist, and projecting out through the fingertips.',
              benefits: 'Opens all major joints, hydrates spinal discs, conditions deep connective tissue.',
              breathingPattern: 'Inhale during the ascending spiral; exhale during the descending sink.',
              commonMistakes: [
                'Spiraling the knees past safe alignment bounds.',
                'Broken, jerky movements instead of fluid curls.',
                'Failing to lead from the soles.'
              ],
              safetyNotes: 'Do not twist the knee joints; ensure rotation happens inside the hip sockets (Kua).',
              frontAnimationPlaceholderId: 'anim-silkreeling-front',
              sideAnimationPlaceholderId: 'anim-silkreeling-side'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'stress-release-flow',
    title: 'Stress Release Flow',
    description: 'Soothe the central nervous system, lower cortisol, and transition from sympathetic flight to parasympathetic flow.',
    focus: ['Relaxation', 'Slow movement', 'Nervous system calming'],
    element: 'water',
    avatarStyle: 'flowing',
    environmentTheme: 'Bamboo Stream Pavilion',
    levels: {
      Beginner: [
        {
          id: 'stress-beg-1',
          title: 'The Calming Breath',
          description: 'A slow-paced, somatic breath sequence designed to slow your heart rate and release adrenaline build-up.',
          duration: 10,
          difficulty: 'Beginner',
          benefits: ['Instantly lowers stress levels', 'Releases thoracic restriction', 'Calms overactive minds'],
          targetAreas: ['Lungs', 'Diaphragm', 'Chest', 'Shoulders'],
          requiredExperience: 'Open to everyone; highly recommended for high-stress days.',
          movements: [
            {
              id: 'm-rising-qi',
              name: 'Rising and Falling Qi',
              traditionalName: '调息 (Tiáo Xī)',
              description: 'Inhale to float arms up to the throat, and exhale to push down gently back to the hips while slightly squatting.',
              benefits: 'Increases lung vital capacity, opens the throat and chest, reduces anxiety.',
              breathingPattern: 'Slow, deep, silent 5-second inhalations and exhalations.',
              commonMistakes: [
                'Over-inflating the upper chest instead of expanding the lower ribs.',
                'Rushing the breath cycle.'
              ],
              safetyNotes: 'Keep your body completely relaxed; feel the air lifting your arms.',
              frontAnimationPlaceholderId: 'anim-risingqi-front',
              sideAnimationPlaceholderId: 'anim-risingqi-side'
            }
          ]
        }
      ],
      Intermediate: [
        {
          id: 'stress-int-1',
          title: 'Somatic Flow Integration',
          description: 'Introduce slow transitions that promote moving with ease, preventing energy stagnation in times of pressure.',
          duration: 12,
          difficulty: 'Intermediate',
          benefits: ['Reduces physical bracing', 'Improves digestive qi', 'Unlocks tight ribcage fascia'],
          targetAreas: ['Obliques', 'Waist', 'Lats', 'Upper arms'],
          requiredExperience: 'Familiarity with foundational breathing flows.',
          movements: [
            {
              id: 'm-parting-mane',
              name: "Parting the Wild Horse's Mane",
              traditionalName: '野马分鬃 (Yě Mǎ Fēn Zōng)',
              description: 'Step diagonally while dividing your hands: one sweeping upward to face level, the other pressing downward toward the hip.',
              benefits: 'Stretches the shoulder blades, opens the lungs, expands lateral stability.',
              breathingPattern: 'Inhale to gather the ball of energy at the core; exhale to step and glide hands apart.',
              commonMistakes: [
                'Leaning too far forward.',
                'Letting the front knee overshoot the front toes.',
                'Dropping the rear elbow.'
              ],
              safetyNotes: 'Keep your back heel rooted and maintain a straight line from heel to crown.',
              frontAnimationPlaceholderId: 'anim-partingmane-front',
              sideAnimationPlaceholderId: 'anim-partingmane-side'
            }
          ]
        }
      ],
      Advanced: [
        {
          id: 'stress-adv-1',
          title: 'Autonomic System Reset',
          description: 'An advanced slow sequence emphasizing extreme deceleration and deep focus to reset cellular stress memory.',
          duration: 15,
          difficulty: 'Advanced',
          benefits: ['Improves autonomic nerve tone', 'Promotes cellular oxygenation', 'Creates absolute stillness'],
          targetAreas: ['Vagus nerve', 'Sub-occipitals', 'Psoas', 'Spine'],
          requiredExperience: 'Requires high degree of patient mind-body pacing.',
          movements: [
            {
              id: 'm-playing-lute',
              name: 'Playing the Lute',
              traditionalName: '手挥琵琶 (Shǒu Huī Pípa)',
              description: 'Shift weight fully onto the back leg, raising the front toes, and bring hands close to align as if holding a classical lute.',
              benefits: 'Develops supreme balance, opens the thoracic spine, calms the vagus nerve.',
              breathingPattern: 'Inhale as you gather weight backward; exhale as hands align and front heel roots.',
              commonMistakes: [
                'Collapsing the chest in the posture.',
                'Straining the neck forward.',
                'Stiffening the hands.'
              ],
              safetyNotes: 'All weight is on the rear leg; ensure the rear hip socket is fully aligned and strong.',
              frontAnimationPlaceholderId: 'anim-lute-front',
              sideAnimationPlaceholderId: 'anim-lute-side'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'posture-alignment',
    title: 'Posture Alignment',
    description: 'Decompress your vertebrae, drop your shoulders, and establish an effortless vertical skeletal hanging structure.',
    focus: ['Spine awareness', 'Shoulder relaxation', 'Standing structure'],
    element: 'air',
    avatarStyle: 'flowing',
    environmentTheme: 'High Mountain Sanctuary',
    levels: {
      Beginner: [
        {
          id: 'posture-beg-1',
          title: 'Spinal Centering',
          description: 'A beginner lesson focused on lengthening the neck vertebrae and releasing shoulder blades downward.',
          duration: 12,
          difficulty: 'Beginner',
          benefits: ['Relieves neck strain', 'Reduces rounded shoulders', 'Lengthens cervical spine'],
          targetAreas: ['Cervical spine', 'Trapezius', 'Neck', 'Shoulder blades'],
          requiredExperience: 'Suitable for all practitioners, especially office workers.',
          movements: [
            {
              id: 'm-holding-ball',
              name: 'Holding the Ball',
              traditionalName: '抱球 (Bào Qiú)',
              description: 'Frame an imaginary circular sphere between your chest and pelvis, aligning your palms while keeping the elbows heavy.',
              benefits: 'Opens the spine, relaxes the shoulders, stabilizes posture.',
              breathingPattern: 'Slow, regular inhales and exhales, feeling the ball expand and contract.',
              commonMistakes: [
                'Allowing the elbows to wing outward.',
                'Dropping the chin down.',
                'Rigid shoulders.'
              ],
              safetyNotes: 'Keep the spine tall, imagine the crown of your head suspended from a thread.',
              frontAnimationPlaceholderId: 'anim-holdball-front',
              sideAnimationPlaceholderId: 'anim-holdball-side'
            }
          ]
        }
      ],
      Intermediate: [
        {
          id: 'posture-int-1',
          title: 'Thoracic Decompression',
          description: 'A intermediate flow designed to rotate the thoracic cavity, lubricating ribs and letting the shoulder blades slide.',
          duration: 15,
          difficulty: 'Intermediate',
          benefits: ['Increases torso rotation', 'Improves breathing room', 'Loosens stiff upper back'],
          targetAreas: ['Thoracic spine', 'Rotator cuff', 'Rib cage', 'Pectorals'],
          requiredExperience: 'Experience with basic standing structures.',
          movements: [
            {
              id: 'm-opening-chest',
              name: 'Opening the Chest',
              traditionalName: '展开胸怀 (Zhǎn Kāi Xiōng Huái)',
              description: 'Extend arms fully outwards, turning the palms upwards, and arching the upper spine subtly before drawing hands back.',
              benefits: 'Counteracts desk posture, expands lung meridians, stretches the front fascia.',
              breathingPattern: 'Inhale as the arms expand wide; exhale as they draw back to parallel.',
              commonMistakes: [
                'Hyper-extending the lumbar spine (lower back arching).',
                'Dropping the head backward and pinching the neck.'
              ],
              safetyNotes: 'Initiate the opening solely from the chest (sternum) and thoracic spine, not the lower back.',
              frontAnimationPlaceholderId: 'anim-openchest-front',
              sideAnimationPlaceholderId: 'anim-openchest-side'
            }
          ]
        }
      ],
      Advanced: [
        {
          id: 'posture-adv-1',
          title: 'Standing Like a Mountain',
          description: 'Achieve perfect dynamic equilibrium with postures that challenge the spine while keeping joints perfectly decompressed.',
          duration: 18,
          difficulty: 'Advanced',
          benefits: ['Maximizes vertical core alignment', 'Releases lower back load', 'Strengthens lateral joints'],
          targetAreas: ['Lumbar spine', 'Pelvis', 'Sacrum', 'Kua (hips)'],
          requiredExperience: 'Prior experience with advanced leg structures.',
          movements: [
            {
              id: 'm-needle-bottom',
              name: 'Needle at Sea Bottom',
              traditionalName: '海底针 (Hǎi Dǐ Zhēn)',
              description: 'Sink your weight back, bow slightly from the waist while pointing the fingers of one hand straight down, tracing the central channel.',
              benefits: 'Stretches the hamstrings, decompresses the spine, coordinates deep pelvic mechanics.',
              breathingPattern: 'Inhale as you shift back and raise the arm; exhale as you bow and point downward.',
              commonMistakes: [
                'Bending the lower back instead of hinging from the hip.',
                'Letting the head drop below the heart.',
                'Straining the neck.'
              ],
              safetyNotes: 'Ensure your back leg supports 95% of your weight. Keep your knee soft and aligned.',
              frontAnimationPlaceholderId: 'anim-needle-front',
              sideAnimationPlaceholderId: 'anim-needle-side'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'balance-mobility',
    title: 'Balance & Mobility',
    description: 'Stabilize your ankle and hip joints, master the substantial/insubstantial weight transition, and glide with steady ease.',
    focus: ['Weight shifting', 'Stability', 'Lower body control'],
    levels: {
      Beginner: [
        {
          id: 'balance-beg-1',
          title: 'The Weighted Shifting',
          description: 'Master the core Tai Chi skill of differentiating between full (substantial) and empty (insubstantial) legs.',
          duration: 12,
          difficulty: 'Beginner',
          benefits: ['Dramatically improves balance', 'Strengthens knee stabilizers', 'Reduces fall risk'],
          targetAreas: ['Quadriceps', 'Glutes', 'Ankles', 'Sole receptors'],
          requiredExperience: 'Excellent for older adults or individuals building joint stability.',
          movements: [
            {
              id: 'm-pour-weight',
              name: 'Pouring the Weight',
              traditionalName: '虚实分明 (Xū Shí Fēn Míng)',
              description: 'Slowly slide your center of gravity from 50/50 balance fully to 100% on one leg, leaving the other completely empty.',
              benefits: 'Awakens balance reflexes, activates hip rotators, increases ankle bone density.',
              breathingPattern: 'Inhale to gather at center; exhale as you slowly shift into one side.',
              commonMistakes: [
                'Leaning the torso to the side (losing vertical line).',
                'Letting the weight-bearing knee wobble.'
              ],
              safetyNotes: 'Keep your hips completely level. Imagine water slowly pouring from one leg container to another.',
              frontAnimationPlaceholderId: 'anim-pour-front',
              sideAnimationPlaceholderId: 'anim-pour-side'
            }
          ]
        }
      ],
      Intermediate: [
        {
          id: 'balance-int-1',
          title: 'Fluid Pivots & Transitions',
          description: 'Incorporate circular steps, sweeping weight transitions, and directional changes without interrupting flow.',
          duration: 15,
          difficulty: 'Intermediate',
          benefits: ['Increases range of hip movement', 'Improves functional walking stride', 'Coordinates total-body weight'],
          targetAreas: ['Adductors', 'Calves', 'Pelvis', 'Kua (hips)'],
          requiredExperience: 'Understanding of substantial/insubstantial weight shifting.',
          movements: [
            {
              id: 'm-repulse-monkey',
              name: 'Repulse Monkey',
              traditionalName: '倒卷肱 (Dào Juǎn Gōng)',
              description: 'Step backward in circular semi-arcs, sweeping one hand backwards to shoulder level while pushing the other forward.',
              benefits: 'Develops spatial balance, opens shoulder joints, improves hip joint flexibility.',
              breathingPattern: 'Inhale as the arm reaches back; exhale as you step backward and press.',
              commonMistakes: [
                'Stepping in a straight narrow line (tightrope walking).',
                'Collapsing the rear knee inward.'
              ],
              safetyNotes: 'Maintain shoulder-width spacing between your feet (railroad tracks) even when stepping backward.',
              frontAnimationPlaceholderId: 'anim-monkey-front',
              sideAnimationPlaceholderId: 'anim-monkey-side'
            }
          ]
        }
      ],
      Advanced: [
        {
          id: 'balance-adv-1',
          title: 'Single-Leg Equilibrium',
          description: 'Advanced dynamic stability postures that challenge balance with single-leg pivots and deep vertical sinks.',
          duration: 20,
          difficulty: 'Advanced',
          benefits: ['Strengthens core stabilizers', 'Teaches extreme balance recoveries', 'Builds lower body joint power'],
          targetAreas: ['Iliopsoas', 'Ankle tendons', 'Gluteus medius', 'Spinal muscles'],
          requiredExperience: 'Excellent knee strength and stable standing background.',
          movements: [
            {
              id: 'm-golden-rooster',
              name: 'Golden Rooster Stands on One Leg',
              traditionalName: '金鸡独立 (Jīn Jī Dú Lì)',
              description: 'Raise one knee up toward the waist while pushing the same-side hand upward and pressing the other hand down.',
              benefits: 'Calms the nervous system, drastically improves single-leg balance, strengthens hips.',
              breathingPattern: 'Inhale as you raise the knee and arm; exhale as you sink down into the rooted leg.',
              commonMistakes: [
                'Arching the spine or locking the standing knee.',
                'Tensing the shoulders while raising the arm.'
              ],
              safetyNotes: 'Keep the standing knee slightly bent (active rooting). Ensure your eyes look at a level horizon.',
              frontAnimationPlaceholderId: 'anim-rooster-front',
              sideAnimationPlaceholderId: 'anim-rooster-side'
            }
          ]
        }
      ]
    }
  }
];
