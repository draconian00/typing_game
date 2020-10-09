import CompleteView from '@/views/Complete';

describe('complete view', () => {
  let instance: CompleteView;

  beforeEach(() => {
    instance = new CompleteView();
  });

  it('pass params', () => {
    instance = new CompleteView({
      avgTime: 3,
      totalScore: 12,
      totalTime: 36,
    });
    expect(instance.avgTime).toBe(3);
    expect(instance.totalScore).toBe(12);
    expect(instance.totalTime).toBe(36);
  });

  it('check render result', () => {
    const renderHtml = instance.render();
    expect(instance.$componentEl).toBeDefined();
    expect(renderHtml).toBeInstanceOf(HTMLElement);
  });
});
